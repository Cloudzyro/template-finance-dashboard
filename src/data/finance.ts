// Every name, number and date in the dashboard comes from this file.
// It's fictional sample data for "Greenway Grounds", a small landscaping
// business. Replace these arrays with calls to your own API or bank feed.

export const app = {
  name: "Fieldbook",
  business: "Greenway Grounds",
  owner: "Rosa Delgado",
  initials: "RD",
  // The dashboard treats this as "today", so the sample always looks current.
  // Delete it (or set it to null) to use the real date once your data is live.
  today: "2026-11-25" as string | null,
  currency: "USD",
  locale: "en-US",
};

export type AccountKind = "checking" | "savings" | "credit";

export type Account = {
  id: string;
  name: string;
  bank: string;
  kind: AccountKind;
  last4: string;
  balance: number;
  // Balance at the end of last month, for the change line
  balanceLastMonth: number;
  // Credit cards only
  limit?: number;
};

export const accounts: Account[] = [
  {
    id: "chk",
    name: "Operating checking",
    bank: "Bayfield Credit Union",
    kind: "checking",
    last4: "4821",
    balance: 48215.6,
    balanceLastMonth: 48910.13,
  },
  {
    id: "sav",
    name: "Tax reserve savings",
    bank: "Bayfield Credit Union",
    kind: "savings",
    last4: "0937",
    balance: 31940.0,
    balanceLastMonth: 31940.0,
  },
  {
    id: "card",
    name: "Business card",
    bank: "Northway Card Services",
    kind: "credit",
    last4: "7714",
    balance: -3482.17,
    balanceLastMonth: -2915.4,
    limit: 15000,
  },
];

export const categories = [
  "Client payments",
  "Payroll",
  "Plants and materials",
  "Fuel",
  "Equipment",
  "Vehicle",
  "Insurance",
  "Office and rent",
  "Software",
  "Utilities",
  "Phone",
  "Meals",
  "Taxes",
  "Card payment",
] as const;

export type Category = (typeof categories)[number];

export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  payee: string;
  memo?: string;
  account: string; // Account id
  category: Category;
  amount: number; // Positive is money in, negative is money out
  status: "cleared" | "pending";
};

export const transactions: Transaction[] = [
  { id: "t101", date: "2026-11-24", payee: "Linden Park HOA", memo: "Invoice 1187, fall cleanup", account: "chk", category: "Client payments", amount: 6400, status: "pending" },
  { id: "t102", date: "2026-11-23", payee: "Quickfill Station 12", account: "card", category: "Fuel", amount: -186.42, status: "pending" },
  { id: "t103", date: "2026-11-21", payee: "Payroll run", memo: "Nov 8 to Nov 21, 6 crew", account: "chk", category: "Payroll", amount: -6820.4, status: "cleared" },
  { id: "t104", date: "2026-11-20", payee: "Maple Court Apartments", memo: "Invoice 1183, monthly grounds", account: "chk", category: "Client payments", amount: 4250, status: "cleared" },
  { id: "t105", date: "2026-11-19", payee: "Corner Street Deli", memo: "Crew lunch, Riverbend job", account: "card", category: "Meals", amount: -48.6, status: "cleared" },
  { id: "t106", date: "2026-11-18", payee: "Westbrook Nursery", memo: "Boxwood and mulch", account: "card", category: "Plants and materials", amount: -1248.9, status: "cleared" },
  { id: "t107", date: "2026-11-17", payee: "Cedar Ridge Dental", memo: "Invoice 1179, leaf removal", account: "chk", category: "Client payments", amount: 1180, status: "cleared" },
  { id: "t108", date: "2026-11-16", payee: "Stone and Soil Supply", memo: "Pavers, Hollis patio", account: "card", category: "Plants and materials", amount: -918.4, status: "cleared" },
  { id: "t109", date: "2026-11-15", payee: "Pinecrest Equipment Rental", memo: "Stump grinder, 2 days", account: "chk", category: "Equipment", amount: -640, status: "cleared" },
  { id: "t110", date: "2026-11-14", payee: "Hollis residence", memo: "Invoice 1176, patio deposit", account: "chk", category: "Client payments", amount: 2960, status: "cleared" },
  { id: "t111", date: "2026-11-12", payee: "Quickfill Station 12", account: "card", category: "Fuel", amount: -212.75, status: "cleared" },
  { id: "t112", date: "2026-11-11", payee: "Harbor Mutual Insurance", memo: "General liability, monthly", account: "chk", category: "Insurance", amount: -1120, status: "cleared" },
  { id: "t113", date: "2026-11-09", payee: "Shoreline Truck Service", memo: "Brakes, truck 2", account: "card", category: "Vehicle", amount: -486.3, status: "cleared" },
  { id: "t114", date: "2026-11-07", payee: "Payroll run", memo: "Oct 25 to Nov 7, 6 crew", account: "chk", category: "Payroll", amount: -6794.1, status: "cleared" },
  { id: "t115", date: "2026-11-07", payee: "Riverbend Office Park", memo: "Invoice 1170, aeration", account: "chk", category: "Client payments", amount: 3875, status: "cleared" },
  { id: "t116", date: "2026-11-05", payee: "Fieldsoft Scheduling", memo: "Crew scheduling app", account: "card", category: "Software", amount: -89, status: "cleared" },
  { id: "t117", date: "2026-11-04", payee: "Ridgeline Utilities", memo: "Yard water and power", account: "chk", category: "Utilities", amount: -164.28, status: "cleared" },
  { id: "t118", date: "2026-11-03", payee: "Sunfield Elementary PTA", memo: "Invoice 1166, garden beds", account: "chk", category: "Client payments", amount: 985, status: "cleared" },
  { id: "t119", date: "2026-11-02", payee: "Westbrook Nursery", memo: "Perennials, Maple Court", account: "card", category: "Plants and materials", amount: -732.15, status: "cleared" },
  { id: "t120", date: "2026-11-01", payee: "Elm Street Properties", memo: "Yard and office lease", account: "chk", category: "Office and rent", amount: -1450, status: "cleared" },
  { id: "t090", date: "2026-10-30", payee: "Clearwave Mobile", memo: "4 crew phones", account: "chk", category: "Phone", amount: -142, status: "cleared" },
  { id: "t089", date: "2026-10-28", payee: "Bayfield Credit Union", memo: "Truck loan payment", account: "chk", category: "Vehicle", amount: -612.4, status: "cleared" },
  { id: "t088", date: "2026-10-27", payee: "Linden Park HOA", memo: "Invoice 1158, October service", account: "chk", category: "Client payments", amount: 6400, status: "cleared" },
  { id: "t087", date: "2026-10-24", payee: "Payroll run", memo: "Oct 11 to Oct 24, 7 crew", account: "chk", category: "Payroll", amount: -7912.85, status: "cleared" },
  { id: "t086", date: "2026-10-22", payee: "Quickfill Station 12", account: "card", category: "Fuel", amount: -241.18, status: "cleared" },
  { id: "t085", date: "2026-10-20", payee: "Maple Court Apartments", memo: "Invoice 1152, monthly grounds", account: "chk", category: "Client payments", amount: 4250, status: "cleared" },
  { id: "t084", date: "2026-10-16", payee: "Westbrook Nursery", memo: "Mums and bulbs", account: "card", category: "Plants and materials", amount: -1604.32, status: "cleared" },
  { id: "t083", date: "2026-10-15", payee: "State tax department", memo: "Q3 estimated tax", account: "sav", category: "Taxes", amount: -4800, status: "cleared" },
  { id: "t082", date: "2026-10-13", payee: "Ashford Commons", memo: "Invoice 1147, irrigation shutdown", account: "chk", category: "Client payments", amount: 2340, status: "cleared" },
  { id: "t081", date: "2026-10-10", payee: "Payroll run", memo: "Sep 27 to Oct 10, 7 crew", account: "chk", category: "Payroll", amount: -7884.2, status: "cleared" },
  { id: "t080", date: "2026-10-08", payee: "Riverbend Office Park", memo: "Invoice 1141, monthly grounds", account: "chk", category: "Client payments", amount: 3875, status: "cleared" },
  { id: "t079", date: "2026-10-05", payee: "Fieldsoft Scheduling", memo: "Crew scheduling app", account: "card", category: "Software", amount: -89, status: "cleared" },
  { id: "t078", date: "2026-10-01", payee: "Elm Street Properties", memo: "Yard and office lease", account: "chk", category: "Office and rent", amount: -1450, status: "cleared" },
];

// Money in and out per month across all accounts. The current month is worked
// out from the transactions above, so the chart and the list always agree.
export const cashFlowHistory: { month: string; moneyIn: number; moneyOut: number }[] = [
  { month: "2025-12", moneyIn: 14200, moneyOut: 17640 },
  { month: "2026-01", moneyIn: 11850, moneyOut: 15210 },
  { month: "2026-02", moneyIn: 13920, moneyOut: 16080 },
  { month: "2026-03", moneyIn: 26410, moneyOut: 22830 },
  { month: "2026-04", moneyIn: 38960, moneyOut: 29340 },
  { month: "2026-05", moneyIn: 44620, moneyOut: 33150 },
  { month: "2026-06", moneyIn: 47180, moneyOut: 35420 },
  { month: "2026-07", moneyIn: 45830, moneyOut: 34910 },
  { month: "2026-08", moneyIn: 41290, moneyOut: 31260 },
  { month: "2026-09", moneyIn: 36740, moneyOut: 28410 },
  { month: "2026-10", moneyIn: 29480, moneyOut: 26360 },
];

// Monthly spending limits per category. People can change them on the
// Budgets page; their changes are kept in the browser (localStorage).
export const budgets: { category: Category; limit: number }[] = [
  { category: "Payroll", limit: 15000 },
  { category: "Plants and materials", limit: 3000 },
  { category: "Office and rent", limit: 1450 },
  { category: "Insurance", limit: 1120 },
  { category: "Equipment", limit: 600 },
  { category: "Fuel", limit: 500 },
  { category: "Vehicle", limit: 400 },
  { category: "Utilities", limit: 250 },
  { category: "Software", limit: 150 },
  { category: "Meals", limit: 120 },
];

export type Bill = {
  id: string;
  name: string;
  payee: string;
  amount: number;
  // Next due date
  due: string;
  cadence: "Monthly" | "Quarterly" | "Yearly";
  autopay: boolean;
  account: string;
  category: Category;
};

export const bills: Bill[] = [
  { id: "b1", name: "Phone plan", payee: "Clearwave Mobile", amount: 142, due: "2026-11-27", cadence: "Monthly", autopay: false, account: "chk", category: "Phone" },
  { id: "b2", name: "Truck loan", payee: "Bayfield Credit Union", amount: 612.4, due: "2026-11-28", cadence: "Monthly", autopay: true, account: "chk", category: "Vehicle" },
  { id: "b3", name: "Workers' comp premium", payee: "Harbor Mutual Insurance", amount: 389, due: "2026-11-30", cadence: "Monthly", autopay: false, account: "chk", category: "Insurance" },
  { id: "b4", name: "Yard and office lease", payee: "Elm Street Properties", amount: 1450, due: "2026-12-01", cadence: "Monthly", autopay: true, account: "chk", category: "Office and rent" },
  { id: "b5", name: "Yard water and power", payee: "Ridgeline Utilities", amount: 171.5, due: "2026-12-04", cadence: "Monthly", autopay: false, account: "chk", category: "Utilities" },
  { id: "b6", name: "Scheduling app", payee: "Fieldsoft Scheduling", amount: 89, due: "2026-12-05", cadence: "Monthly", autopay: true, account: "card", category: "Software" },
  { id: "b7", name: "General liability", payee: "Harbor Mutual Insurance", amount: 1120, due: "2026-12-11", cadence: "Monthly", autopay: true, account: "chk", category: "Insurance" },
  { id: "b8", name: "Card statement", payee: "Northway Card Services", amount: 3482.17, due: "2026-12-14", cadence: "Monthly", autopay: false, account: "chk", category: "Card payment" },
  { id: "b9", name: "Mower lease", payee: "Pinecrest Equipment Rental", amount: 315, due: "2026-12-18", cadence: "Monthly", autopay: false, account: "chk", category: "Equipment" },
  { id: "b10", name: "Q4 estimated tax", payee: "State tax department", amount: 4800, due: "2027-01-15", cadence: "Quarterly", autopay: false, account: "sav", category: "Taxes" },
  { id: "b11", name: "Business license", payee: "Bayfield County Clerk", amount: 250, due: "2027-03-01", cadence: "Yearly", autopay: false, account: "chk", category: "Office and rent" },
];
