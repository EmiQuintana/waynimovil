import { http } from "./http";

export type Contact = {
  id: string;
  name: string;
  handle: string;
};

export function getContacts() {
  return http<Contact[]>("/api/contacts");
}
