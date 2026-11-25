import { Search } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { PageHead } from "../components/Layout";
import { LedgerRow } from "../components/Ledger";
import { accounts, categories, type Transaction } from "../data/finance";
import { fmt, fmtDayLong, signed } from "../lib/format";
import { useTransactions } from "../lib/store";

export function Transactions() {
  const { list, setCategory } = useTransactions();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const account = params.get("account") ?? "";

  function set(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return list.filter(
      (t) =>
        (!category || t.category === category) &&
        (!account || t.account === account) &&
        (!needle || `${t.payee} ${t.memo ?? ""} ${t.category} ${Math.abs(t.amount).toFixed(2)}`.toLowerCase().includes(needle)),
    );
  }, [list, q, category, account]);

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of filtered) {
      const g = map.get(t.date) ?? [];
      g.push(t);
      map.set(t.date, g);
    }
    return [...map.entries()];
  }, [filtered]);

  const moneyIn = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const moneyOut = filtered.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
  const pending = filtered.filter((t) => t.status === "pending").length;
  const filteredView = Boolean(q || category || account);

  return (
    <>
      <PageHead title="Activity" sub="Every transaction across your accounts. Change a category and the budgets follow" />

      <div className="toolbar" role="search">
        <label className="search">
          <span className="sr-only">Search transactions</span>
          <Search size={16} strokeWidth={1.5} aria-hidden="true" />
          <input className="field" type="search" placeholder="Search" value={q} onChange={(e) => set("q", e.target.value)} />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select className="field" value={category} onChange={(e) => set("category", e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Account</span>
          <select className="field" value={account} onChange={(e) => set("account", e.target.value)}>
            <option value="">All accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} {a.last4}
              </option>
            ))}
          </select>
        </label>
        {filteredView && (
          <button type="button" className="btn btn-quiet" onClick={() => setParams({}, { replace: true })}>
            Clear filters
          </button>
        )}
      </div>

      <section className="panel totals" aria-label="Totals for the transactions shown">
        <div>
          <p className="label">{filteredView ? "Matching" : "Transactions"}</p>
          <p className="value num">{filtered.length}</p>
        </div>
        <div>
          <p className="label">Money in</p>
          <p className="value num pos">{fmt(moneyIn)}</p>
        </div>
        <div>
          <p className="label">Money out</p>
          <p className="value num">{fmt(moneyOut)}</p>
        </div>
        <div>
          <p className="label">Net{pending ? `, ${pending} pending` : ""}</p>
          <p className="value num">{signed(moneyIn - moneyOut)}</p>
        </div>
      </section>

      <section className="panel" aria-label="Transactions by day" aria-live="polite">
        {groups.length === 0 ? (
          <p className="empty">No transactions match. Try another search or clear the filters.</p>
        ) : (
          groups.map(([date, items]) => {
            const dayNet = items.reduce((s, t) => s + t.amount, 0);
            return (
              <div className="day-group" key={date}>
                <h2 className="day-head">
                  <span>{fmtDayLong(date)}</span>
                  <span className="num">{signed(dayNet)}</span>
                </h2>
                <ul className="ledger">
                  {items.map((t) => (
                    <LedgerRow key={t.id} t={t} onCategory={setCategory} />
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </section>
    </>
  );
}
