"use client";

import { useQuery } from "@tanstack/react-query";
import { getDirectory, withLocalProfile } from "@/services/users";

export const directoryQueryKey = ["directory", "profile-v2"] as const;

export function useDirectory() {
  return useQuery({
    queryKey: directoryQueryKey,
    queryFn: getDirectory,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useCurrentUser() {
  const query = useDirectory();

  return {
    ...query,
    data: query.data?.currentUser
      ? withLocalProfile(query.data.currentUser)
      : undefined,
  };
}

export function useContacts() {
  const query = useDirectory();

  return {
    ...query,
    data: query.data?.contacts,
  };
}
