export function buzz(): void {
  if ('vibrate' in navigator) navigator.vibrate(15);
}

export function todayKey(): string {
  return new Date().toDateString();
}
