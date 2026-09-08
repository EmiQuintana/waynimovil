"use client";

import { useQuery } from "@tanstack/react-query";
import { getMovements, getWallet } from "@/services/wallet";

export const walletQueryKey = ["wallet"] as const;
export const movementsQueryKey = ["movements"] as const;

export function useWallet() {
  return useQuery({
    queryKey: walletQueryKey,
    queryFn: getWallet,
  });
}

export function useMovements() {
  return useQuery({
    queryKey: movementsQueryKey,
    queryFn: getMovements,
  });
}
