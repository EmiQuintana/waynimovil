"use client";

import { useQuery } from "@tanstack/react-query";
import { getLedger } from "@/services/wallet";

export const ledgerQueryKey = ["ledger"] as const;
export const walletQueryKey = ledgerQueryKey;
export const movementsQueryKey = ledgerQueryKey;

export function useLedger() {
  return useQuery({
    queryKey: ledgerQueryKey,
    queryFn: getLedger,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useWallet() {
  const query = useLedger();

  return {
    ...query,
    data: query.data ? { balance: query.data.balance } : undefined,
  };
}

export function useMovements() {
  const query = useLedger();

  return {
    ...query,
    data: query.data?.movements,
  };
}
