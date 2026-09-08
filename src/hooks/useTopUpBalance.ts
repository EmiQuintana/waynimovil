"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLedger, topUpToInitialBalance } from "@/services/wallet";
import { ledgerQueryKey } from "./useWallet";

export function useTopUpBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const movement = topUpToInitialBalance();

      if (!movement) {
        throw new Error("Balance is already at the initial amount");
      }

      return movement;
    },
    onSuccess: () => {
      queryClient.setQueryData(ledgerQueryKey, getLedger());
    },
  });
}
