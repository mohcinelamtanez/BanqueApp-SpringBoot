import { Card } from "../ui";
export default function ClientProfileCard({ client }) {
  return;
  <Card className="profile">
    <h1>{client.name}</h1>
    <p className="mono">
      {client.id} · {client.city}
    </p>
  </Card>;
}
