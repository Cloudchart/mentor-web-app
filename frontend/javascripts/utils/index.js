export function pluralize(count, singular, plural) {
  return count == 1
    ? `${count} ${singular}`
    : `${count} ${plural}`
}
