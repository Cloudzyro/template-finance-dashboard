import { RefreshCw } from "lucide-react";
import { PageHead } from "../components/Layout";
import { accounts, bills, type Bill } from "../data/finance";
import { daysBetween, fmt, fmtDay, fmtWeekday, isoDay, parseDate, today } from "../lib/format";
import { usePaidBills } from "../lib/store";

const accountById = Object.fromEntries(accounts.map((a) => [a.id, a]));

function dueLabel(days: number) {
  if (days < 0) return `${-days} days late`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `In ${days} days`;
}

export function Bills() {
  const [paid, setPaid] = usePaidBills();
  const now = today();

  const withDays = bills.map((b) => ({ ...b, days: daysBetween(now, parseDate(b.due)) }));
  const open = withDays.filter((b) => !paid[b.id]);
  const done = withDays.filter((b) => paid[b.id]);
  const thisWeek = open.filter((b) => b.days <= 7);
  const later = open.filter((b) => b.days > 7);
  const next30 = open.filter((b) => b.days <= 30);
  const next30Total = next30.reduce((s, b) => s + b.amount, 0);
  const autopayTotal = next30.filter((b) => b.autopay).reduce((s, b) => s + b.amount, 0);
  const monthly = bills.reduce((s, b) => s + (b.cadence === "Monthly" ? b.amount : b.cadence === "Quarterly" ? b.amount / 3 : b.amount / 12), 0);

  const days = Array.from({ length: 30 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i));
  const byDay = new Map<string, Bill[]>();
  for (const b of open) byDay.set(b.due, [...(byDay.get(b.due) ?? []), b]);

  function markPaid(id: string) {
    setPaid((p) => ({ ...p, [id]: isoDay(now) }));
  }
  function undo(id: string) {
    setPaid((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
  }

  const row = (b: (typeof withDays)[number], isPaid = false) => (
    <tr key={b.id}>
      <td>
        <p className="row-title">{b.name}</p>
        <p className="row-sub">
          <span className="show-sm">{isPaid ? "Paid" : fmtDay(b.due)}, </span>
          {b.payee}, from {accountById[b.account]?.name.toLowerCase()}
        </p>
      </td>
      <td className="hide-sm">
        <p className="num">{fmtDay(b.due)}</p>
        <p className={`row-sub ${!isPaid && b.days <= 3 ? "due-soon" : ""}`}>{isPaid ? b.cadence : dueLabel(b.days)}</p>
      </td>
      <td className="hide-sm">
        {b.autopay ? (
          <span className="autopay">
            <RefreshCw size={16} strokeWidth={1.5} aria-hidden="true" />
            Autopay
          </span>
        ) : (
          <span className="autopay">By hand</span>
        )}
      </td>
      <td className="r num">{fmt(b.amount)}</td>
      <td className="r">
        {isPaid ? (
          <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <span className="paid-note">Paid {fmtDay(paid[b.id])}</span>
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => undo(b.id)} aria-label={`Undo paid for ${b.name}`}>
              Undo
            </button>
          </span>
        ) : b.autopay ? (
          <span className="row-sub">Pays itself</span>
        ) : (
          <button type="button" className="btn btn-sm" onClick={() => markPaid(b.id)} aria-label={`Mark ${b.name} paid`}>
            Mark paid
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <>
      <PageHead title="Bills" sub="Recurring payments and when they leave your accounts" />

      <section className="panel" aria-labelledby="strip-title" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div>
            <h2 id="strip-title">Next 30 days</h2>
            <p className="hint">Blue dots need paying by hand, grey dots pay themselves</p>
          </div>
        </div>
        <ol className="strip" style={{ listStyle: "none", margin: 0 }}>
          {days.map((d, i) => {
            const due = byDay.get(isoDay(d)) ?? [];
            const first = i === 0 || d.getDate() === 1;
            return (
              <li
                key={i}
                className={`strip-day ${i === 0 ? "today" : ""} ${due.length ? "has" : ""}`}
                aria-label={`${fmtDay(isoDay(d))}${due.length ? `: ${due.map((b) => `${b.name} ${fmt(b.amount)}`).join(", ")}` : ""}`}
                title={due.map((b) => `${b.name} ${fmt(b.amount)}`).join("\n") || undefined}
              >
                <span className="strip-month" aria-hidden="true">
                  {first ? d.toLocaleDateString("en-US", { month: "short" }) : ""}
                </span>
                <span aria-hidden="true">{fmtWeekday(d).slice(0, 2)}</span>
                <span className="n" aria-hidden="true">
                  {d.getDate()}
                </span>
                <span className="strip-dots" aria-hidden="true">
                  {due.slice(0, 3).map((b) => (
                    <i key={b.id} className={b.autopay ? "" : "manual"} />
                  ))}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="bills-grid">
        <section className="panel" aria-label="Bills" style={{ overflow: "hidden" }}>
          <table className="bill-table">
            <thead>
              <tr>
                <th>Bill</th>
                <th className="hide-sm">Due</th>
                <th className="hide-sm">Payment</th>
                <th className="r">Amount</th>
                <th className="r">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {thisWeek.length > 0 && (
                <tr className="section">
                  <td colSpan={5}>Due this week</td>
                </tr>
              )}
              {thisWeek.map((b) => row(b))}
              {later.length > 0 && (
                <tr className="section">
                  <td colSpan={5}>Later</td>
                </tr>
              )}
              {later.map((b) => row(b))}
              {done.length > 0 && (
                <tr className="section">
                  <td colSpan={5}>Paid</td>
                </tr>
              )}
              {done.map((b) => row(b, true))}
            </tbody>
          </table>
        </section>

        <aside className="panel side-figures" aria-label="Bill totals">
          <p className="label">Due in the next 30 days</p>
          <p className="value num">{fmt(next30Total)}</p>
          <dl>
            <div>
              <dt>On autopay</dt>
              <dd className="num">{fmt(autopayTotal)}</dd>
            </div>
            <div>
              <dt>To pay by hand</dt>
              <dd className="num">{fmt(next30Total - autopayTotal)}</dd>
            </div>
            <div>
              <dt>All bills, per month</dt>
              <dd className="num">{fmt(monthly)}</dd>
            </div>
            <div>
              <dt>Checking balance</dt>
              <dd className="num">{fmt(accountById.chk?.balance ?? 0)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </>
  );
}
