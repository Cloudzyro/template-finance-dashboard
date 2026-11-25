import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { PageHead } from "../components/Layout";
import type { Category } from "../data/finance";
import { fmt, fmtMonth, today } from "../lib/format";
import { spentThisMonth, useBudgetLimits, useTransactions } from "../lib/store";

export function Budgets() {
  const { list: txns } = useTransactions();
  const { list, setLimit, reset, changed } = useBudgetLimits();
  const [editing, setEditing] = useState<Category | null>(null);
  const spent = spentThisMonth(txns);
  const now = today();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const pace = now.getDate() / daysInMonth;

  const totalLimit = list.reduce((s, b) => s + b.limit, 0);
  const totalSpent = list.reduce((s, b) => s + (spent[b.category] ?? 0), 0);
  const over = list.filter((b) => (spent[b.category] ?? 0) > b.limit);

  function save(e: FormEvent<HTMLFormElement>, category: Category) {
    e.preventDefault();
    const raw = new FormData(e.currentTarget).get("limit")?.toString().replace(/[$,\s]/g, "") ?? "";
    const value = Number(raw);
    if (Number.isFinite(value) && value >= 0) setLimit(category, Math.round(value * 100) / 100);
    setEditing(null);
  }

  return (
    <>
      <PageHead title="Budgets" sub={`Monthly limits by category, ${fmtMonth(now)}`}>
        {changed && (
          <button type="button" className="btn btn-quiet" onClick={reset}>
            Reset to sample limits
          </button>
        )}
      </PageHead>

      <section className="panel budget-summary" aria-label="This month">
        <div>
          <p className="label">Spent this month</p>
          <p className="value num">{fmt(totalSpent)}</p>
          <p className="note">
            Day {now.getDate()} of {daysInMonth}, {Math.round(pace * 100)}% of the month gone
          </p>
        </div>
        <div>
          <p className="label">Budgeted</p>
          <p className="value num">{fmt(totalLimit)}</p>
        </div>
        <div>
          <p className="label">Left to spend</p>
          <p className={`value num ${totalLimit - totalSpent < 0 ? "neg" : ""}`}>{fmt(totalLimit - totalSpent)}</p>
        </div>
        <div>
          <p className="label">Over budget</p>
          <p className={`value num ${over.length ? "neg" : ""}`}>{over.length}</p>
          <p className="note">{over.length ? over.map((b) => b.category).join(", ") : "None so far"}</p>
        </div>
      </section>

      <section className="panel" aria-label="Categories">
        <div className="panel-head" style={{ paddingBottom: 16, borderBottom: "1px solid var(--line)" }}>
          <div>
            <h2>Categories</h2>
            <p className="hint">The blue tick marks where spending would be if it ran evenly through the month</p>
          </div>
        </div>
        <ul className="ledger">
          {list.map((b) => {
            const s = spent[b.category] ?? 0;
            const ratio = b.limit > 0 ? s / b.limit : s > 0 ? 2 : 0;
            const state = ratio > 1 ? "over" : ratio >= 0.9 && ratio < 1 && ratio > pace + 0.05 ? "near" : "";
            const left = b.limit - s;
            return (
              <li key={b.category} className="budget-row">
                <div>
                  <p className="row-title">{b.category}</p>
                  <Link className="row-sub" style={{ textDecoration: "none", display: "block" }} to={`/transactions?category=${encodeURIComponent(b.category)}`}>
                    See transactions
                  </Link>
                </div>
                <div className="bar-cell">
                  <div
                    className="track"
                    role="progressbar"
                    aria-label={`${b.category}: ${fmt(s)} of ${fmt(b.limit)}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(Math.min(ratio, 1) * 100)}
                  >
                    <div className={`fill ${state}`} style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
                    <div className="pace" style={{ left: `calc(${pace * 100}% - 1px)` }} aria-hidden="true" />
                  </div>
                  <div className="budget-meta num">
                    <span>
                      {fmt(s)} of {fmt(b.limit)}
                    </span>
                    <span className={left < 0 ? "neg" : ""}>{left < 0 ? `Over by ${fmt(-left)}` : `${fmt(left)} left`}</span>
                  </div>
                </div>
                <div className="budget-figs">
                  {editing === b.category ? (
                    <form className="limit-form" onSubmit={(e) => save(e, b.category)}>
                      <label className="sr-only" htmlFor={`limit-${b.category}`}>
                        Monthly limit for {b.category}
                      </label>
                      <input
                        id={`limit-${b.category}`}
                        name="limit"
                        className="field"
                        inputMode="decimal"
                        defaultValue={b.limit.toFixed(2)}
                        autoFocus
                        onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
                      />
                      <button type="submit" className="btn btn-primary btn-sm">
                        Save
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="num fg2">{fmt(b.limit)}</span>
                      <button type="button" className="btn btn-sm" onClick={() => setEditing(b.category)} aria-label={`Edit limit for ${b.category}`}>
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <p className="panel notice">
        Limits you change are saved in this browser. The sample limits live in <code>src/data/finance.ts</code>.
      </p>
    </>
  );
}
