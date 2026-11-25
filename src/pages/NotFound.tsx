import { Link } from "react-router";
import { PageHead } from "../components/Layout";

export function NotFound() {
  return (
    <>
      <PageHead title="Page not found" sub="That address doesn't match any page in this dashboard" />
      <Link className="btn" to="/">
        Back to overview
      </Link>
    </>
  );
}
