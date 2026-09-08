export const INITIAL_BALANCE = 2800;
const STORAGE_KEY = "wayniwallet.ledger";

export type MovementType = "transfer" | "cashin" | "expense";

export type Movement = {
  id: string;
  title: string;
  amount: number;
  type: MovementType;
  createdAt: string;
  contactId?: string;
};

export type Ledger = {
  balance: number;
  movements: Movement[];
};

export type TransferPayload = {
  contactId: string;
  amount: number;
  concept: string;
};

const defaultLedger: Ledger = {
  balance: INITIAL_BALANCE,
  movements: [],
};

function isLedger(value: unknown): value is Ledger {
  if (!value || typeof value !== "object") {
    return false;
  }

  const ledger = value as Ledger;
  return typeof ledger.balance === "number" && Array.isArray(ledger.movements);
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

export function getWallet() {
  return Promise.resolve({ balance: getLedger().balance });
}

export function getMovements() {
  return Promise.resolve(getLedger().movements);
}

export function createTransfer(payload: TransferPayload) {
  const ledger = getLedger();

  if (payload.amount <= 0) {
    return Promise.reject(new Error("Invalid amount"));
  }

  if (payload.amount > ledger.balance) {
    return Promise.reject(new Error("Insufficient funds"));
  }

  const movement: Movement = {
    id: crypto.randomUUID(),
    title: payload.concept || "Transfer",
    amount: -payload.amount,
    type: "transfer",
    createdAt: new Date().toISOString(),
    contactId: payload.contactId,
  };

  saveLedger({
    balance: Number((ledger.balance - payload.amount).toFixed(2)),
    movements: [movement, ...ledger.movements],
  });

  return Promise.resolve(movement);
}
