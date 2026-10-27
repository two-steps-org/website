const fmtLong = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const fmtMonthShort = new Intl.DateTimeFormat('en-US', { month: 'short' });
const fmtDay = new Intl.DateTimeFormat('en-US', { day: '2-digit' });
const fmtYear = new Intl.DateTimeFormat('en-US', { year: 'numeric' });

export function formatBlogDate(isoDate: string) {
  if (!isoDate) return { long: '', month: '', day: '', year: '' };
  const date = new Date(`${isoDate}T12:00:00`);
  return {
    long: fmtLong.format(date),
    month: fmtMonthShort.format(date).toUpperCase(),
    day: fmtDay.format(date),
    year: fmtYear.format(date),
  };
}
