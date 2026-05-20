// ─── Date / Time utilities ──────────────────────────────────────────────────

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatPrice(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export function getDayName(date: Date): string {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[date.getDay()];
}

export function isHoliday(dateStr: string, holidays: { date: string }[]): boolean {
  return holidays.some((h) => h.date === dateStr);
}

// ─── API response helpers ───────────────────────────────────────────────────

export function successResponse<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500) {
  return Response.json({ success: false, error: message }, { status });
}

// ─── Booking number generator ───────────────────────────────────────────────

export function generateBookingNumber(bookingId: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = bookingId.slice(-6).toUpperCase();
  return `BK-${date}-${suffix}`;
}
