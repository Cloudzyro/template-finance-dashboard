import { useState } from "react";
import { fmt, fmtMonthShort, short, signed } from "../lib/format";

type Month = { month: string; moneyIn: number; moneyOut: number };

const WIDE = 760;
const TALL = 320;
const M = { top: 16, right: 8, bottom: 28, left: 52 };

function niceCeil(n: number) {
  return Math.max(10000, Math.ceil(n / 10000) * 10000);
}

/**
 * Money in above the zero line, money out below it, one pair of bars per
 * month. The current month carries the accent; a thin line follows the net.
 */
export function CashFlowChart({ data, compact = false }: { data: Month[]; compact?: boolean }) {
  const W = compact ? 360 : WIDE;
  const H = compact ? 260 : TALL;
  const [active, setActive] = useState<number | null>(null);
  const top = niceCeil(Math.max(...data.map((d) => d.moneyIn)));
  const bottom = niceCeil(Math.max(...data.map((d) => d.moneyOut)));
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const y = (v: number) => M.top + ((top - v) / (top + bottom)) * plotH;
  const band = plotW / data.length;
  const barW = Math.min(28, band * 0.52);
  const cx = (i: number) => M.left + band * i + band / 2;
  const step = top + bottom > 80000 ? 20000 : 10000;
  const ticks: number[] = [];
  for (let v = Math.floor(top / step) * step; v >= -bottom; v -= step) ticks.push(v);
  const last = data.length - 1;
  const net = data.map((d) => d.moneyIn - d.moneyOut);
  const netPath = net.map((v, i) => `${i ? "L" : "M"}${cx(i)},${y(v)}`).join(" ");
  const shown = active ?? null;

  return (
    <div className={`chart-wrap ${compact ? "chart-compact" : "chart-full"}`} onMouseLeave={() => setActive(null)}>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cash flow by month: money in above the line, money out below">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={M.left} x2={W - M.right} y1={y(v)} y2={y(v)} stroke={v === 0 ? "var(--line-strong)" : "var(--grid)"} />
            <text x={M.left - 10} y={y(v) + 4} textAnchor="end">
              {v === 0 ? "$0" : short(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const current = i === last;
          const x = cx(i) - barW / 2;
          const dim = shown !== null && shown !== i;
          return (
            <g key={d.month} opacity={dim ? 0.55 : 1} style={{ transition: "opacity 150ms var(--ease)" }}>
              <rect x={x} y={y(d.moneyIn)} width={barW} height={y(0) - y(d.moneyIn) - 1} rx={3} fill={current ? "var(--accent)" : "var(--bar-in)"} />
              <rect
                x={x}
                y={y(0) + 1}
                width={barW}
                height={y(-d.moneyOut) - y(0) - 1}
                rx={3}
                fill={current ? "var(--accent)" : "var(--bar-out)"}
                fillOpacity={current ? 0.35 : 1}
              />
              <text x={cx(i)} y={H - 8} textAnchor="middle" style={current ? { fill: "var(--fg)" } : undefined}>
                {fmtMonthShort(d.month)}
              </text>
            </g>
          );
        })}
        <path d={netPath} fill="none" stroke="var(--fg-2)" strokeWidth="1.5" strokeLinejoin="round" />
        {net.map((v, i) => (
          <circle key={i} cx={cx(i)} cy={y(v)} r={i === last ? 4 : 2.5} fill={i === last ? "var(--card)" : "var(--fg-2)"} stroke={i === last ? "var(--fg)" : "none"} strokeWidth="1.5" />
        ))}
        {data.map((d, i) => (
          <rect
            key={d.month}
            className="month-hit"
            x={M.left + band * i}
            y={M.top}
            width={band}
            height={plotH}
            tabIndex={0}
            aria-label={`${fmtMonthShort(d.month)}: in ${fmt(d.moneyIn)}, out ${fmt(d.moneyOut)}, net ${signed(d.moneyIn - d.moneyOut)}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          />
        ))}
      </svg>
      {shown !== null && (
        <div
          className="tooltip num"
          style={{
            left: `calc(8px + (100% - 24px) * ${(cx(shown) / W).toFixed(4)})`,
            top: `calc(8px + (100% - 24px) * ${(y(data[shown].moneyIn) / H).toFixed(4)})`,
            marginTop: -8,
          }}
          role="status"
        >
          <p className="t-title">{monthName(data[shown].month)}</p>
          <p>
            <span className="muted">In</span>
            <span>{fmt(data[shown].moneyIn)}</span>
          </p>
          <p>
            <span className="muted">Out</span>
            <span>{fmt(data[shown].moneyOut)}</span>
          </p>
          <p>
            <span className="muted">Net</span>
            <span className={net[shown] >= 0 ? "pos" : "neg"}>{signed(net[shown])}</span>
          </p>
        </div>
      )}
      {!compact && <table className="sr-only">
        <caption>Cash flow by month</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Money in</th>
            <th>Money out</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <td>{monthName(d.month)}</td>
              <td>{fmt(d.moneyIn)}</td>
              <td>{fmt(d.moneyOut)}</td>
              <td>{signed(d.moneyIn - d.moneyOut)}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
}

function monthName(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
