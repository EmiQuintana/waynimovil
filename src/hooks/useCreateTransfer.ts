"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer, getLedger } from "@/services/wallet";
import { useTransferDraftStore } from "@/store/transferDraft";
import { ledgerQueryKey } from "./useWallet";

type ConfirmTransferInput = {
  currentUserId: string;
  forceError?: boolean;
};

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ currentUserId, forceError }: ConfirmTransferInput) => {
      const { recipient, amountCents, concept } =
        useTransferDraftStore.getState();

      if (!recipient || amountCents === null) {
        return Promise.reject(new Error("Incomplete transfer"));
      }

      return createTransfer({
        recipient,
        currentUserId,
        amountCents,
        concept,
        forceError,
      });
    },
    onSuccess: (movement) => {
      queryClient.setQueryData(ledgerQueryKey, getLedger());

      const { recipient, concept } = useTransferDraftStore.getState();

      if (recipient) {
        useTransferDraftStore.getState().setLastCompleted({
          recipient,
          amountCents: Math.abs(movement.amountCents),
          concept,
          createdAt: movement.createdAt,
          reference: movement.reference,
        });
      }
    },
  });
}
