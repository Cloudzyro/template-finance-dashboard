import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import { Layout } from "./components/Layout";
import "./index.css";
import { Bills } from "./pages/Bills";
import { Budgets } from "./pages/Budgets";
import { NotFound } from "./pages/NotFound";
import { Overview } from "./pages/Overview";
import { Transactions } from "./pages/Transactions";

// A hash router keeps every address after a "#" (for example /#/budgets),
// so the server only ever has to send index.html. Deep links and refreshes
// work on any static host with no rewrite rules.
const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Overview /> },
      { path: "/transactions", element: <Transactions /> },
      { path: "/budgets", element: <Budgets /> },
      { path: "/bills", element: <Bills /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
