"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "@/services/wallet";
import { movementsQueryKey, walletQueryKey } from "./useWallet";

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: walletQueryKey }),
        queryClient.invalidateQueries({ queryKey: movementsQueryKey }),
      ]);
    },
  });
}
