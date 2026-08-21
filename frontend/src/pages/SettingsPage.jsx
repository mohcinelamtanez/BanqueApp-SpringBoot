import { useState } from "react";
import { Button, Card, Input, Select } from "../components/ui";
import { PageHeading } from "./pageShared";
export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageHeading
        title="Settings"
        subtitle="Application preferences and basic administrative configuration."
      />
      <div className="settings-grid">
        <Card>
          <h2>General information</h2>
          <div className="form-grid">
            <Input label="Application name" defaultValue="BanqueApp" />
            <Input
              label="Support email"
              type="email"
              defaultValue="contact@banqueapp.com"
            />
            <Input label="Phone" defaultValue="+212 522-000000" />
            <Input label="Location" defaultValue="Casablanca, Morocco" />
          </div>
        </Card>
        <Card>
          <h2>Application preferences</h2>
          <div className="form-grid">
            <Select label="Language" defaultValue="en">
              <option value="en">English</option>
              <option value="fr">French</option>
            </Select>
            <Select label="Currency" defaultValue="MAD">
              <option value="MAD">MAD — Moroccan Dirham</option>
            </Select>
          </div>
          <Button onClick={() => setSaved(true)}>Save preferences</Button>
          {saved && <p className="success-text">Preferences saved locally.</p>}
        </Card>
      </div>
    </>
  );
}
