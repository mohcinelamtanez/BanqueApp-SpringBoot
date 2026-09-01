import { EmptyState } from "../../components/ui";
import { PageHeading } from "../pageShared";
export default function ClientSettingsPage() {
  return (
    <>
      <PageHeading
        title="Settings"
        subtitle="Manage your account preferences."
      />
      <EmptyState title="Settings" detail="Coming soon…" />
    </>
  );
}
