import { useCallback, useEffect, useState } from "react";
import { budgets, cashFlowHistory, transactions, type Category, type Transaction } from "../data/finance";
import { monthKey, today } from "./format";

// Changes people make (a transaction's category, a budget limit, a bill marked
// paid) are kept in this browser with localStorage. Swap these hooks for calls
// to your own API when you connect real data.

const PREFIX = "fieldbook:";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback));
  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Private windows can refuse storage; the page still works for this visit.
    }
  }, [key, value]);
  // Keep tabs in step
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREFIX + key) setValue(read(key, fallback));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // fallback is a constant per call site, so only the key matters
  }, [key]);
  return [value, setValue] as const;
}

/** Transactions with any category changes applied */
export function useTransactions() {
  const [overrides, setOverrides] = useStored<Record<string, Category>>("categories", {});
  const list: Transaction[] = transactions.map((t) => (overrides[t.id] ? { ...t, category: overrides[t.id] } : t));
  const setCategory = useCallback(
    (id: string, category: Category) => setOverrides((o) => ({ ...o, [id]: category })),
    [setOverrides],
  );
  return { list, setCategory };
}

export function useBudgetLimits() {
  const [limits, setLimits] = useStored<Record<string, number>>("budgets", {});
  const list = budgets.map((b) => ({ ...b, limit: limits[b.category] ?? b.limit }));
  const setLimit = (category: Category, limit: number) => setLimits((l) => ({ ...l, [category]: limit }));
  const reset = () => setLimits({});
  return { list, setLimit, reset, changed: Object.keys(limits).length > 0 };
}

export function usePaidBills() {
  return useStored<Record<string, string>>("paid-bills", {});
}

/** Money in and out for the current month, from the transactions */
export function currentMonthFlow(list: Transaction[]) {
  const key = monthKey(today());
  let moneyIn = 0;
  let moneyOut = 0;
  for (const t of list) {
    if (!t.date.startsWith(key)) continue;
    if (t.amount > 0) moneyIn += t.amount;
    else moneyOut += -t.amount;
  }
  return { month: key, moneyIn, moneyOut };
}

export function cashFlow(list: Transaction[]) {
  return [...cashFlowHistory, currentMonthFlow(list)];
}

/** Spending per category in the current month */
export function spentThisMonth(list: Transaction[]) {
  const key = monthKey(today());
  const out: Partial<Record<Category, number>> = {};
  for (const t of list) {
    if (!t.date.startsWith(key) || t.amount >= 0) continue;
    out[t.category] = (out[t.category] ?? 0) - t.amount;
  }
  return out;
}
