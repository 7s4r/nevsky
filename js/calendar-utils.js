// Small helpers extracted from previous calendar code
export function getStartDay(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return (firstDay.getDay() + 6) % 7; // Monday=0
}

export function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
