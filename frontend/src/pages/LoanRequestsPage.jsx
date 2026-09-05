import LoanRequestsTable from "../components/loans/LoanRequestsTable";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Pagination,
} from "../components/ui";
import { useApplications } from "../hooks/useApplications";
import { useClients } from "../hooks/useClients";
import { usePagination } from "../hooks/usePagination";
import { PageHeading } from "./pageShared";
export default function LoanRequestsPage() {
  const {
    loading: applicationsLoading,
    data: applications,
    error,
  } = useApplications();
  const { loading: clientsLoading, data: clients } = useClients();
  if (applicationsLoading || clientsLoading) {
    return <LoadingState label="Loading loan applications…" />;
  }
  if (error) {
    return (
      <ErrorState detail="Unable to load loan applications right now. Please try again." />
    );
  }
  // Pending first (most actionable), then most recently submitted —
  // decided applications stay visible here with their final status rather
  // than disappearing once reviewed.
  const sorted = [...(applications || [])].sort((a, b) => {
    if (a.status === "Pending" && b.status !== "Pending") return -1;
    if (b.status === "Pending" && a.status !== "Pending") return 1;
    return a.submittedDate < b.submittedDate ? 1 : -1;
  });
  const { page, setPage, totalPages, pageItems } = usePagination(sorted, 5);
  return (
    <>
      <PageHeading
        title="Loan Applications"
        subtitle="Review submitted loan applications and their decisions."
      />
      <Card>
        {sorted.length ? (
          <>
            <LoanRequestsTable applications={pageItems} clients={clients || []} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            title="No Loan Applications"
            detail="Loan applications submitted by clients will appear here."
          />
        )}
      </Card>
    </>
  );
}
