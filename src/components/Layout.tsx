import { CalendarClock, LayoutGrid, ListOrdered, PieChart } from "lucide-react";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { app } from "../data/finance";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/transactions", label: "Activity", icon: ListOrdered },
  { to: "/budgets", label: "Budgets", icon: PieChart },
  { to: "/bills", label: "Bills", icon: CalendarClock },
];

export function Logo({ size = 40 }: { size?: number }) {
  // A ruled page, the "field book" the money lives in
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="var(--accent)" />
      <path d="M12 14h16M12 20h16M12 26h10" stroke="var(--accent-text)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <aside className="rail">
        <div className="rail-logo" title={`${app.name}, ${app.business}`}>
          <Logo />
          <span className="sr-only">{app.name}</span>
        </div>
        <nav aria-label="Main">
          <ul>
            {nav.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"} className="rail-link">
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="rail-foot">
          <ThemeToggle />
          <span className="avatar" title={`${app.owner}, ${app.business}`}>
            {app.initials}
          </span>
        </div>
      </aside>
      <main id="main" className="main">
        <div className="enter" key={pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  useEffect(() => {
    document.title = `${title} | ${app.name}`;
  }, [title]);
  return (
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <p className="sub">{sub}</p>}
      </div>
      <div className="head-actions">
        {children}
        <span className="mobile-only">
          <ThemeToggle />
        </span>
      </div>
    </header>
  );
}
