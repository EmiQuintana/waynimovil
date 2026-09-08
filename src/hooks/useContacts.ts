"use client";

import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/services/contacts";

export const contactsQueryKey = ["contacts"] as const;

export function useContacts() {
  return useQuery({
    queryKey: contactsQueryKey,
    queryFn: getContacts,
  });
}
