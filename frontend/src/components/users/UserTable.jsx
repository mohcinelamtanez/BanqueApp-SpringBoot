import { Badge, DataTable } from "../ui";
import { initials } from "../../pages/pageShared";
import { ROLE_LABEL, formatLastLogin } from "../../pages/userManagementShared";
import UserActionsMenu from "./UserActionsMenu";

export default function UserTable({
  users = [],
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) {
  return (
    <div className="client-table user-table">
      <DataTable
        columns={["User", "Email", "Role", "Status", "Last Login", "Actions"]}
      >
        {users.map((user) => {
          const fullName = `${user.firstName} ${user.lastName}`;
          return (
            <tr key={user.id}>
              <td>
                <div className="review-client-cell">
                  <span className="avatar">{initials(fullName)}</span>
                  <b className="cell-strong">{fullName}</b>
                </div>
              </td>
              <td className="mono">{user.email}</td>
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
                />
              </td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}
export { UserTable };
