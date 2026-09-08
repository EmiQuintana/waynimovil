import { create } from "zustand";
import type { AppUser } from "@/services/users";

type TransferDraft = {
  recipient: AppUser | null;
  amount: number | null;
  concept: string;
};

type TransferDraftStore = TransferDraft & {
  setRecipient: (recipient: AppUser | null) => void;
  setAmount: (amount: number | null) => void;
  setConcept: (concept: string) => void;
  reset: () => void;
};

const initialDraft: TransferDraft = {
  recipient: null,
  amount: null,
  concept: "",
};

export const useTransferDraftStore = create<TransferDraftStore>((set) => ({
  ...initialDraft,
  setRecipient: (recipient) => set({ recipient }),
  setAmount: (amount) => set({ amount }),
  setConcept: (concept) => set({ concept }),
  reset: () => set(initialDraft),
}));
