import LoanRequestsTable from "../components/loans/LoanRequestsTable";
import {
  Card,
  EmptyState,
  LoadingState,
  Pagination,
} from "../components/ui";
import { useLoans } from "../hooks/useLoans";
import { usePagination } from "../hooks/usePagination";
import { PageHeading } from "./pageShared";
export default function LoanRequestsPage() {
  const { loading, data: loans } = useLoans();
  const pending = (loans || []).filter((loan) => loan.status === "Pending");
  const { page, setPage, totalPages, pageItems } = usePagination(pending, 5);
  if (loading) return <LoadingState label="Loading loan requests…" />;
  return (
    <>
      <PageHeading
        title="Loan Requests"
        subtitle="Review loan applications waiting for a decision."
      />
      <Card>
        {pending.length ? (
          <>
            <LoanRequestsTable loans={pageItems} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            title="No Pending Loan Requests"
            detail="There are currently no loan requests waiting for review."
          />
        )}
      </Card>
    </>
  );
}
