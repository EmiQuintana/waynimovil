import { create } from "zustand";

type TransferDraft = {
  recipientId: string | null;
  amount: number | null;
  concept: string;
};

type TransferDraftStore = TransferDraft & {
  setRecipientId: (recipientId: string | null) => void;
  setAmount: (amount: number | null) => void;
  setConcept: (concept: string) => void;
  reset: () => void;
};

const initialDraft: TransferDraft = {
  recipientId: null,
  amount: null,
  concept: "",
};

export const useTransferDraftStore = create<TransferDraftStore>((set) => ({
  ...initialDraft,
  setRecipientId: (recipientId) => set({ recipientId }),
  setAmount: (amount) => set({ amount }),
  setConcept: (concept) => set({ concept }),
  reset: () => set(initialDraft),
}));
