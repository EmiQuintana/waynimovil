import type { Movement } from "@/services/wallet";

export function toLocalDateKey(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function filterTransfers(
  transfers: Movement[],
  filters: { contactQuery: string; date: string },
) {
  const contactQuery = filters.contactQuery.trim().toLowerCase();

  return transfers.filter((movement) => {
    const contactName = (movement.contactName ?? movement.title).toLowerCase();
    const matchesContact =
      contactQuery.length === 0 || contactName.includes(contactQuery);
    const matchesDate =
      filters.date.length === 0 ||
      toLocalDateKey(movement.createdAt) === filters.date;

    return matchesContact && matchesDate;
  });
}
