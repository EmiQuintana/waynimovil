"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "@/services/wallet";
import { ledgerQueryKey } from "./useWallet";

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ledgerQueryKey });
    },
  });
}
