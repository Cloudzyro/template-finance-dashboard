import { app } from "../data/finance";

const money = new Intl.NumberFormat(app.locale, {
  style: "currency",
  currency: app.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const MINUS = "−";

/** $48,215.60, or −$3,482.17 (a true minus sign, so columns line up) */
export function fmt(n: number) {
  return (n < 0 ? MINUS : "") + money.format(Math.abs(n));
}

/** +$6,400.00 or −$1,248.90 */
export function signed(n: number) {
  return (n > 0 ? "+" : n < 0 ? MINUS : "") + money.format(Math.abs(n));
}

/** $40k, for chart axes */
export function short(n: number) {
  const a = Math.abs(n);
  const s = a >= 1000 ? `$${Math.round(a / 1000)}k` : `$${a}`;
  return n < 0 ? `${MINUS}${s}` : s;
}

export function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d ?? 1);
}

/** The dashboard's "today": app.today in the data file, or the real date */
export function today() {
  if (app.today) return parseDate(app.today);
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isoDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function monthKey(d: Date) {
  return isoDay(d).slice(0, 7);
}

export function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

const dayLong = new Intl.DateTimeFormat(app.locale, { weekday: "long", month: "long", day: "numeric" });
const dayShort = new Intl.DateTimeFormat(app.locale, { month: "short", day: "numeric" });
const monthLong = new Intl.DateTimeFormat(app.locale, { month: "long", year: "numeric" });
const monthShortF = new Intl.DateTimeFormat(app.locale, { month: "short" });
const weekdayShort = new Intl.DateTimeFormat(app.locale, { weekday: "short" });

export const fmtDayLong = (iso: string) => dayLong.format(parseDate(iso));
export const fmtDay = (iso: string) => dayShort.format(parseDate(iso));
export const fmtMonth = (d: Date) => monthLong.format(d);
export const fmtMonthShort = (iso: string) => monthShortF.format(parseDate(iso));
export const fmtWeekday = (d: Date) => weekdayShort.format(d);

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
