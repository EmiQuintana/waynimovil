import type { AppUser } from "./users";

export const INITIAL_BALANCE_CENTS = 280_000;
const STORAGE_KEY = "wayniwallet.ledger.v2";

export type MovementType = "transfer" | "cashin" | "expense";

export type Movement = {
  id: string;
  title: string;
  amountCents: number;
  type: MovementType;
  createdAt: string;
  reference: string;
  contactId?: string;
  contactName?: string;
  contactAvatar?: string;
};

export type Ledger = {
  balanceCents: number;
  movements: Movement[];
};

export type TransferPayload = {
  recipient: AppUser;
  currentUserId: string;
  amountCents: number;
  concept: string;
  forceError?: boolean;
};

const defaultLedger: Ledger = {
  balanceCents: INITIAL_BALANCE_CENTS,
  movements: [],
};

let transferLock = false;

function wait(ms: number) {
  if (process.env.JEST_WORKER_ID) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isLedger(value: unknown): value is Ledger {
  if (!value || typeof value !== "object") {
    return false;
  }

  const ledger = value as Ledger;
  return (
    Number.isInteger(ledger.balanceCents) && Array.isArray(ledger.movements)
  );
}

function createReference() {
  return String(Date.now() % 100_000_000).padStart(8, "0");
}

export function getLedger(): Ledger {
  if (typeof window === "undefined") {
    return defaultLedger;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLedger));
      return defaultLedger;
    }

    const parsed: unknown = JSON.parse(raw);
    return isLedger(parsed) ? parsed : defaultLedger;
  } catch {
    return defaultLedger;
  }
}

export function saveLedger(ledger: Ledger) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
}

export function clearLedger() {
  transferLock = false;

  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function createTransfer(payload: TransferPayload) {
  if (transferLock) {
    throw new Error("Transfer already in progress");
  }

  transferLock = true;

  try {
    await wait(700);

    if (payload.forceError) {
      throw new Error("NETWORK_ERROR");
    }

    const concept = payload.concept.trim();
    const ledger = getLedger();

    if (!concept) {
      throw new Error("Concept is required");
    }

    if (!Number.isInteger(payload.amountCents) || payload.amountCents <= 0) {
      throw new Error("Invalid amount");
    }

    if (payload.amountCents > ledger.balanceCents) {
      throw new Error("Insufficient funds");
    }

    if (payload.recipient.id === payload.currentUserId) {
      throw new Error("Cannot transfer to yourself");
    }

    const movement: Movement = {
      id: crypto.randomUUID(),
      title: concept,
      amountCents: -payload.amountCents,
      type: "transfer",
      createdAt: new Date().toISOString(),
      reference: createReference(),
      contactId: payload.recipient.id,
      contactName: payload.recipient.fullName,
      contactAvatar: payload.recipient.avatar,
    };

    saveLedger({
      balanceCents: ledger.balanceCents - payload.amountCents,
      movements: [movement, ...ledger.movements],
    });

    return movement;
  } finally {
    transferLock = false;
  }
}

export function cashIn(amountCents: number, title = "CashIn") {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("Invalid amount");
  }

  const ledger = getLedger();
  const movement: Movement = {
    id: crypto.randomUUID(),
    title,
    amountCents,
    type: "cashin",
    createdAt: new Date().toISOString(),
    reference: createReference(),
  };

  saveLedger({
    balanceCents: ledger.balanceCents + amountCents,
    movements: [movement, ...ledger.movements],
  });

  return movement;
}

export function topUpToInitialBalance() {
  const ledger = getLedger();
  const amountCents = INITIAL_BALANCE_CENTS - ledger.balanceCents;

  if (amountCents <= 0) {
    return null;
  }

  return cashIn(amountCents);
}
