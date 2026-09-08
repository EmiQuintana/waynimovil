const numberFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return `$ ${numberFormatter.format(Math.abs(amount))}`;
}

export function formatSignedCurrency(amount: number): string {
  const formatted = formatCurrency(amount);

  if (amount < 0) {
    return `-${formatted}`;
  }

  if (amount > 0) {
    return `+ ${formatted}`;
  }

  return formatted;
}
