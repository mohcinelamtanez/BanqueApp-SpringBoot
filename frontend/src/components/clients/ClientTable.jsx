import { DataTable } from "../ui";
export default function ClientTable({ clients = [], children }) {
  return(
  <DataTable
    columns={[
      "Client name",
      "Client ID",
      "Location",
      "Annual income",
      "Actions",
    ]}
  >
    {children ||
      clients.map((client) => (
        <tr key={client.id}>
          <td>{client.name}</td>
          <td>{client.id}</td>
          <td>{client.city}</td>
          <td>{client.income}</td>
          <td />
        </tr>
      ))}
  </DataTable>);
}
