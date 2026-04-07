export function formatTime(value) {
  if (!value) return "TBD";
  const parts = String(value).split(":");
  if (parts.length < 2) return value;
  let hour = parseInt(parts[0], 10);
  const minute = parts[1];
  if (Number.isNaN(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}
