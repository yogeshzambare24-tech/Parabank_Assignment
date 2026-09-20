export function parseCurrency(value: string | null | undefined): number {
  if (!value) {
    throw new Error('Expected a currency value, but received an empty value.');
  }

  const normalized = value.replace(/[^0-9.-]+/g, '');
  const amount = Number(normalized);
  if (!Number.isFinite(amount)) {
    throw new Error(`Unable to parse currency value: "${value}"`);
  }

  return Math.round(amount * 100) / 100;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}