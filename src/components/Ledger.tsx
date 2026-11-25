import { accounts, categories, type Category, type Transaction } from "../data/finance";
import { signed } from "../lib/format";

const accountById = Object.fromEntries(accounts.map((a) => [a.id, a]));

/** Signed mono amount with its cleared or pending mark */
export function Amount({ value, status }: { value: number; status: Transaction["status"] }) {
  return (
    <span className={`amount ${value > 0 ? "in" : ""}`}>
      {signed(value)}
      <span className={`mark ${status}`} title={status === "cleared" ? "Cleared" : "Pending"} aria-hidden="true" />
      <span className="sr-only">{status === "cleared" ? "cleared" : "pending"}</span>
    </span>
  );
}

export function LedgerRow({
  t,
  onCategory,
  sub,
}: {
  t: Transaction;
  onCategory?: (id: string, c: Category) => void;
  sub?: string;
}) {
  const acct = accountById[t.account];
  return (
    <li className="ledger-row">
      <div style={{ minWidth: 0 }}>
        <p className="row-title">{t.payee}</p>
        <p className="row-sub">{sub ?? t.memo ?? (t.status === "pending" ? "Pending" : " ")}</p>
      </div>
      <div className="cat-cell" style={{ minWidth: 0 }}>
        {onCategory ? (
          <select
            className="cat-select"
            value={t.category}
            aria-label={`Category for ${t.payee}, ${signed(t.amount)}`}
            onChange={(e) => onCategory(t.id, e.target.value as Category)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        ) : (
          <span className="cat">{t.category}</span>
        )}
      </div>
      <div className="acct-cell acct" title={acct?.name}>
        {acct ? `${acct.kind === "credit" ? "Card" : acct.kind === "savings" ? "Savings" : "Checking"} ${acct.last4}` : ""}
      </div>
      <div className="amount-cell">
        <Amount value={t.amount} status={t.status} />
      </div>
    </li>
  );
}
