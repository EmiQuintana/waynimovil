const AMOUNT_PATTERN = /^\d+([.,]\d{1,2})?$/;

export function parseAmountToCents(raw: string): number | null {
  const value = raw.trim();

  if (!value || !AMOUNT_PATTERN.test(value)) {
    return null;
  }

  const [whole, fraction = ""] = value.replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));

  if (!Number.isSafeInteger(cents) || cents <= 0) {
    return null;
  }

  return cents;
}

export function formatCents(cents: number): string {
  const absolute = Math.abs(cents);
  const whole = Math.trunc(absolute / 100);
  const fraction = String(absolute % 100).padStart(2, "0");
  const wholeFormatted = new Intl.NumberFormat("es-AR").format(whole);

  return `$ ${wholeFormatted},${fraction}`;
}

export function formatSignedCents(cents: number): string {
  const formatted = formatCents(cents);

  if (cents < 0) {
    return `-${formatted}`;
  }

  if (cents > 0) {
    return `+ ${formatted}`;
  }

  return formatted;
}
