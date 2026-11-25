import { Link } from "react-router";
import type { Account } from "../data/finance";
import { fmt } from "../lib/format";

const kindLabel = { checking: "Checking", savings: "Savings", credit: "Credit card" };

function Chip() {
  return (
    <svg className="chip" width="34" height="26" viewBox="0 0 34 26" aria-hidden="true">
      <defs>
        <linearGradient id="chip-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9cfae" />
          <stop offset="1" stopColor="#b7a77a" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="33" height="25" rx="5" fill="url(#chip-metal)" stroke="rgba(0,0,0,0.18)" />
      <path d="M0.5 9h10M0.5 17h10M23.5 9h10M23.5 17h10M10.5 0.5v25M23.5 0.5v25M10.5 13h13" stroke="rgba(60,48,20,0.35)" fill="none" />
    </svg>
  );
}

function Lines() {
  // Fine engraved arcs, like the pattern printed on a real card
  const arcs = Array.from({ length: 9 }, (_, i) => 40 + i * 18);
  return (
    <svg className="lines" viewBox="0 0 220 220" aria-hidden="true">
      {arcs.map((r) => (
        <circle key={r} cx="220" cy="220" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" />
      ))}
    </svg>
  );
}

export function BankCard({ account }: { account: Account }) {
  const owed = account.kind === "credit";
  const available = owed && account.limit ? account.limit + account.balance : null;
  return (
    <Link
      to={`/transactions?account=${account.id}`}
      className={`bank-card ${account.kind}`}
      aria-label={`${account.name}, ${kindLabel[account.kind]} ending ${account.last4}, ${owed ? "owed" : "balance"} ${fmt(Math.abs(account.balance))}. Show transactions`}
    >
      <Lines />
      <div className="top">
        <div>
          <p className="kind">{account.name}</p>
          <p className="bank">{account.bank}</p>
        </div>
        {owed ? <Chip /> : null}
      </div>
      <div className="bottom">
        <p className="bal num">{fmt(Math.abs(account.balance))}</p>
        <div className="meta">
          <span>{owed ? `Owed, ${fmt(available ?? 0)} available` : kindLabel[account.kind]}</span>
          <span className="num">{"••••"} {account.last4}</span>
        </div>
      </div>
    </Link>
  );
}
