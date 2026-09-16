import { Badge, DataTable } from "../ui";
import { ROLE_LABEL, formatLastLogin } from "../../pages/userManagementShared";
import UserActionsMenu from "./UserActionsMenu";

export default function UserTable({
  users = [],
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onAssignRole,
}) {
  return (
    <div className="client-table user-table">
      <DataTable
        columns={["User", "Role", "Status", "Last Login", "Actions"]}
      >
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <div className="review-client-cell">
                <span className="avatar">{user.email?.[0]?.toUpperCase()}</span>
                <b className="cell-strong mono">{user.email}</b>
              </div>
            </td>
            <td>
              <Badge type={user.role === "ADMIN" ? "role-admin" : ""}>
                {ROLE_LABEL[user.role] || user.role}
              </Badge>
            </td>
            <td>
              <span
                className={`status-chip ${user.status === "Active" ? "actif" : "inactif"}`}
              >
                {user.status}
              </span>
            </td>
            <td>{formatLastLogin(user.lastLogin)}</td>
            <td>
              <UserActionsMenu
                user={user}
                onView={onView}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onResetPassword={onResetPassword}
                onAssignRole={onAssignRole}
              />
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
export { UserTable };
