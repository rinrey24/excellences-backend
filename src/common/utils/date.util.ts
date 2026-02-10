export function parseInaDate(value?: string): Date | null {
  if (!value || value === 'None' || value === '-') return null;

  // format: DD/MM/YYYY
  const [dd, mm, yyyy] = value.split('/');
  if (!dd || !mm || !yyyy) return null;

  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}
