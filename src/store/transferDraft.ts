import { create } from "zustand";
import type { AppUser } from "@/services/users";
import { parseAmountToCents } from "@/utils/money";

export type CompletedTransfer = {
  recipient: AppUser;
  amountCents: number;
  concept: string;
  createdAt: string;
  reference: string;
};

type TransferDraft = {
  recipient: AppUser | null;
  amountInput: string;
  amountCents: number | null;
  concept: string;
  lastCompleted: CompletedTransfer | null;
};

type TransferDraftStore = TransferDraft & {
  startTransfer: (recipient: AppUser) => void;
  setRecipient: (recipient: AppUser | null) => void;
  setAmountInput: (amountInput: string) => void;
  setConcept: (concept: string) => void;
  setLastCompleted: (lastCompleted: CompletedTransfer | null) => void;
  reset: () => void;
};

const initialDraft: TransferDraft = {
  recipient: null,
  amountInput: "",
  amountCents: null,
  concept: "",
  lastCompleted: null,
};

export const useTransferDraftStore = create<TransferDraftStore>((set) => ({
  ...initialDraft,
  startTransfer: (recipient) =>
    set({
      recipient,
      amountInput: "",
      amountCents: null,
      concept: "",
    }),
  setRecipient: (recipient) => set({ recipient }),
  setAmountInput: (amountInput) =>
    set({
      amountInput,
      amountCents: parseAmountToCents(amountInput),
    }),
  setConcept: (concept) => set({ concept }),
  setLastCompleted: (lastCompleted) => set({ lastCompleted }),
  reset: () => set(initialDraft),
}));
