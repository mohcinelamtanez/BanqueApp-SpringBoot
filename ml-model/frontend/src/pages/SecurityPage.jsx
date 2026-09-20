import { Download } from "lucide-react";
import { Badge, Button, Card, DataTable } from "../components/ui";
import { PageHeading } from "./pageShared";
export default function SecurityPage() {
  return (
    <>
      <PageHeading
        title="Security Management"
        subtitle="Visual audit overview for the BanqueApp portal."
        action={
          <Button>
            <Download size={16} /> Export audit log
          </Button>
        }
      />
      <Card>
        <div className="section-head">
          <h2>Security audit</h2>
          <Badge>Review needed</Badge>
        </div>
        <DataTable columns={["Event", "Date", "Information", "Status"]}>
          <tr>
            <td>Administrative configuration updated</td>
            <td>20 Aug 2026</td>
            <td>Application preferences were reviewed.</td>
            <td>
              <Badge>Recorded</Badge>
            </td>
          </tr>
          <tr>
            <td>Security audit generated</td>
            <td>19 Aug 2026</td>
            <td>Audit log is available for export.</td>
            <td>
              <Badge>Completed</Badge>
            </td>
          </tr>
        </DataTable>
      </Card>
    </>
  );
}
