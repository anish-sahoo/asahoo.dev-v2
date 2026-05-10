export function formatDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}
