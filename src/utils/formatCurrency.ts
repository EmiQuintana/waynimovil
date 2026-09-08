import { formatCents, formatSignedCents } from "./money";

export function formatCurrency(amountCents: number): string {
  return formatCents(amountCents);
}

export function formatSignedCurrency(amountCents: number): string {
  return formatSignedCents(amountCents);
}
