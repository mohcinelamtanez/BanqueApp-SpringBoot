import { EmptyState } from "../../components/ui";
import { PageHeading } from "../pageShared";
export default function ClientDashboardPage() {
  return (
    <>
      <PageHeading
        title="Dashboard"
        subtitle="Your personal banking overview."
      />
      <EmptyState title="Client Dashboard" detail="Coming soon…" />
    </>
  );
}
