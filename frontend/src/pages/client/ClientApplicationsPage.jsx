import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button, Card, EmptyState, ErrorState, LoadingState } from "../../components/ui";
import ApplicationCard from "../../components/loans/ApplicationCard";
import NewApplicationModal from "../../components/loans/NewApplicationModal";
import ApplicationDetailsModal from "../../components/loans/ApplicationDetailsModal";
import { applicationService } from "../../services/applicationService";
import { loanService } from "../../services/loanService";
import { PageHeading } from "../pageShared";

export default function ClientApplicationsPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [hasActiveLoan, setHasActiveLoan] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([applicationService.listMine(), loanService.listMine()])
      .then(([applicationsData, loansData]) => {
        if (!active) return;
        setApplications(applicationsData);
        setHasActiveLoan(loansData.some((loan) => loan.status === "Active"));
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Unable to load your applications right now. Please try again.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  if (loading) return <LoadingState label="Loading your applications…" />;
  if (error) return <ErrorState detail={error} />;

  const sortedApplications = [...applications].sort((a, b) =>
    a.submittedDate < b.submittedDate ? 1 : -1,
  );
  const hasPending = sortedApplications.some(
    (application) => application.status === "Pending",
  );
  // Mirrors the backend eligibility rule exactly: no ACTIVE Loan and no
  // PENDING Application. The backend remains the authoritative check —
  // this only drives the UX (locked note + disabled action).
  const canApply = !hasPending && !hasActiveLoan;
  const viewing = applicationId
    ? sortedApplications.find(
        (application) => String(application.id) === applicationId,
      ) || null
    : null;

  const openNewApplication = () => setShowNew(true);
  const onApplicationCreated = () => {
    setShowNew(false);
    setReloadKey((key) => key + 1);
  };

  return (
    <>
      <PageHeading
        title="My Applications"
        subtitle="Track your loan applications and their current status."
        action={
          canApply && sortedApplications.length > 0 ? (
            <Button onClick={openNewApplication}>
              <Plus size={17} /> New Application
            </Button>
          ) : null
        }
      />

      {hasPending && (
        <Card className="application-locked-note">
          <p>
            <b>You already have a pending loan application.</b> Please wait
            until a decision has been made before submitting another
            application.
          </p>
        </Card>
      )}

      {!hasPending && hasActiveLoan && (
        <Card className="application-locked-note">
          <p>
            <b>You already have an active loan.</b> You can apply for a new
            loan once your current loan is fully paid off or otherwise
            closed.
          </p>
        </Card>
      )}

      {sortedApplications.length === 0 ? (
        <Card>
          <EmptyState
            title="No loan applications yet"
            detail="Ready to apply for your first loan?"
          />
          <div className="application-empty-action">
            <Button onClick={openNewApplication}>
              <Plus size={17} /> Start an Application
            </Button>
          </div>
        </Card>
      ) : (
        <div className="stack-gap">
          {sortedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              canCreateNew={canApply}
              onViewDetails={() =>
                navigate(`/my-applications/${application.id}`)
              }
              onCreateNew={openNewApplication}
            />
          ))}
        </div>
      )}

      {showNew && (
        <NewApplicationModal
          onClose={() => setShowNew(false)}
          onCreated={onApplicationCreated}
        />
      )}
      {viewing && (
        <ApplicationDetailsModal
          application={viewing}
          onClose={() => navigate("/my-applications")}
        />
      )}
    </>
  );
}
