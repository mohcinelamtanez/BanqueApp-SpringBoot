import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button, Card, EmptyState, LoadingState } from "../../components/ui";
import ApplicationCard from "../../components/loans/ApplicationCard";
import NewApplicationModal from "../../components/loans/NewApplicationModal";
import ApplicationDetailsModal from "../../components/loans/ApplicationDetailsModal";
import { loanService } from "../../services/loanService";
import { PageHeading } from "../pageShared";
import { CURRENT_CLIENT_ID } from "./clientShared";

export default function ClientApplicationsPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loanService.list().then((data) => {
      if (active) {
        setLoans(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  if (loading) return <LoadingState label="Loading your applications…" />;

  const myApplications = loans
    .filter((loan) => loan.clientId === CURRENT_CLIENT_ID)
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  const hasPending = myApplications.some((loan) => loan.status === "Pending");
  const viewing = applicationId
    ? myApplications.find((loan) => loan.id === applicationId) || null
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
          !hasPending && myApplications.length > 0 ? (
            <Button onClick={openNewApplication}>
              <Plus size={17} /> New Application
            </Button>
          ) : null
        }
      />

      {hasPending && (
        <Card className="application-locked-note">
          <p>
            <b>You already have an application under review.</b> Please wait
            until a decision has been made before submitting another
            application.
          </p>
        </Card>
      )}

      {myApplications.length === 0 ? (
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
          {myApplications.map((loan) => (
            <ApplicationCard
              key={loan.id}
              loan={loan}
              canCreateNew={!hasPending}
              onViewDetails={() => navigate(`/my-applications/${loan.id}`)}
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
          loan={viewing}
          onClose={() => navigate("/my-applications")}
        />
      )}
    </>
  );
}
