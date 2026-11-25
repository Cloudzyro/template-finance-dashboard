import { Download } from "lucide-react";
import { Link } from "react-router";
import { BankCard } from "../components/BankCard";
import { CashFlowChart } from "../components/CashFlowChart";
import { PageHead } from "../components/Layout";
import { LedgerRow } from "../components/Ledger";
import { accounts, app, bills } from "../data/finance";
import { daysBetween, fmt, fmtMonth, parseDate, signed, today } from "../lib/format";
import { cashFlow, usePaidBills, useTransactions } from "../lib/store";

export function Overview() {
  const { list } = useTransactions();
  const [paid] = usePaidBills();
  const now = today();
  const flow = cashFlow(list);
  const current = flow[flow.length - 1];
  const net = current.moneyIn - current.moneyOut;

  const cash = accounts.filter((a) => a.kind !== "credit").reduce((s, a) => s + a.balance, 0);
  const owed = accounts.filter((a) => a.kind === "credit").reduce((s, a) => s + a.balance, 0);
  const position = cash + owed;
  const positionLast = accounts.reduce((s, a) => s + a.balanceLastMonth, 0);
  const change = position - positionLast;

  const upcoming = bills
    .filter((b) => !paid[b.id])
    .filter((b) => {
      const d = daysBetween(now, parseDate(b.due));
      return d >= 0 && d <= 30;
    })
    .slice(0, 5);
  const upcomingTotal = upcoming.reduce((s, b) => s + b.amount, 0);

  function exportCsv() {
    const rows = [["Month", "Money in", "Money out", "Net"], ...flow.map((f) => [f.month, f.moneyIn.toFixed(2), f.moneyOut.toFixed(2), (f.moneyIn - f.moneyOut).toFixed(2)])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cash-flow.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <PageHead title="Overview" sub={`${app.business}, ${fmtMonth(now)}`}>
        <button type="button" className="btn" onClick={exportCsv}>
          <Download size={16} strokeWidth={1.5} aria-hidden="true" />
          Export
        </button>
      </PageHead>

      <section className="accounts" aria-label="Accounts">
        <div className="net">
          <div>
            <p className="label">Net position</p>
            <p className="figure num">{fmt(position)}</p>
            <p className="change">
              <span className={`num ${change >= 0 ? "pos" : "neg"}`}>{signed(change)}</span> vs end of last month
            </p>
          </div>
          <dl>
            <div>
              <dt>Cash</dt>
              <dd className="num">{fmt(cash)}</dd>
            </div>
            <div>
              <dt>Owed on cards</dt>
              <dd className="num">{fmt(Math.abs(owed))}</dd>
            </div>
          </dl>
        </div>
        {accounts.map((a) => (
          <BankCard key={a.id} account={a} />
        ))}
      </section>

      <div className="overview-grid">
        <section className="panel" aria-labelledby="cf-title">
          <div className="panel-head cf-head">
            <div>
              <h2 id="cf-title">Cash flow</h2>
              <p className="hint">Money in and out across all accounts, last 12 months</p>
              <div className="legend">
                <span>
                  <i style={{ background: "var(--bar-in)" }} />
                  In
                </span>
                <span>
                  <i style={{ background: "var(--bar-out)" }} />
                  Out
                </span>
                <span>
                  <i style={{ background: "var(--fg-2)", height: 2, borderRadius: 1 }} />
                  Net
                </span>
              </div>
            </div>
            <div className="chart-figures">
              <p className="hint muted">{fmtMonth(now).split(" ")[0]} so far, net</p>
              <p className="big num">{signed(net)}</p>
              <p className="hint muted num">
                In {fmt(current.moneyIn)}, out {fmt(current.moneyOut)}
              </p>
            </div>
          </div>
          <CashFlowChart data={flow} />
          <CashFlowChart data={flow.slice(-6)} compact />
        </section>

        <section className="panel" aria-labelledby="bills-title" style={{ display: "flex", flexDirection: "column" }}>
          <div className="panel-head">
            <div>
              <h2 id="bills-title">Upcoming bills</h2>
              <p className="hint">Next 30 days</p>
            </div>
            <Link className="panel-link" to="/bills">
              All bills
            </Link>
          </div>
          <ul className="bill-list" style={{ flex: 1 }}>
            {upcoming.map((b) => {
              const d = parseDate(b.due);
              return (
                <li key={b.id} className="bill-row">
                  <span className="date-tile" aria-hidden="true">
                    <span className="m">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                    <span className="d">{d.getDate()}</span>
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p className="row-title">{b.name}</p>
                    <p className="row-sub">
                      {b.autopay ? "Autopay" : "Pay by hand"}, {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span className="num">{fmt(b.amount)}</span>
                </li>
              );
            })}
          </ul>
          <div className="panel-foot">
            <span>{upcoming.length} bills</span>
            <span className="num">{fmt(upcomingTotal)}</span>
          </div>
        </section>
      </div>

      <section className="panel" aria-labelledby="recent-title">
        <div className="panel-head" style={{ paddingBottom: 12 }}>
          <div>
            <h2 id="recent-title">Recent transactions</h2>
            <p className="hint">Filled dot cleared, open dot pending</p>
          </div>
          <Link className="panel-link" to="/transactions">
            All transactions
          </Link>
        </div>
        <ul className="ledger" style={{ borderTop: "1px solid var(--line)" }}>
          {list.slice(0, 7).map((t) => (
            <LedgerRow key={t.id} t={t} sub={`${new Date(parseDate(t.date)).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${t.memo ? `, ${t.memo}` : ""}`} />
          ))}
        </ul>
      </section>
    </>
  );
}
