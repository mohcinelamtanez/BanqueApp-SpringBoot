import { useEffect, useState } from "react";
import { Briefcase, Plus, Search, ShieldCheck, UserCheck, Users } from "lucide-react";
import {
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  LoadingState,
  Pagination,
  SuccessModal,
} from "../components/ui";
import UserTable from "../components/users/UserTable";
import UserFormModal from "../components/users/UserFormModal";
import UserProfileModal from "../components/users/UserProfileModal";
import { userService } from "../services/userService";
import { usePagination } from "../hooks/usePagination";
import { Metric, PageHeading } from "./pageShared";

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [formModal, setFormModal] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    userService.list().then((data) => {
      if (active) {
        setUsers(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const shown = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const {
    page,
    setPage,
    totalPages,
    pageItems,
    rangeStart,
    rangeEnd,
  } = usePagination(shown, 5);

  if (loading) return <LoadingState label="Loading users…" />;

  const reload = () => setReloadKey((key) => key + 1);
  const changeQuery = (value) => {
    setQuery(value);
    setPage(1);
  };

  const total = users.length;
  const activeCount = users.filter((user) => user.status === "Active").length;
  const bankAgentCount = users.filter((user) => user.role === "BANK_AGENT").length;
  const adminCount = users.filter((user) => user.role === "ADMIN").length;

  const closeStatusConfirm = () => {
    if (togglingStatus) return;
    setStatusTarget(null);
  };
  const confirmToggleStatus = async () => {
    setTogglingStatus(true);
    const nextStatus = statusTarget.status === "Active" ? "Inactive" : "Active";
    await userService.update(statusTarget.id, { status: nextStatus });
    setTogglingStatus(false);
    setStatusTarget(null);
    reload();
  };

  const closeResetConfirm = () => {
    if (resettingPassword) return;
    setResetTarget(null);
  };
  const confirmResetPassword = async () => {
    setResettingPassword(true);
    // Frontend-only simulation — no real password reset logic/backend call.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setResettingPassword(false);
    setResetTarget(null);
    setSuccess({
      title: "Password Reset Successfully",
      message: `A temporary password has been generated for ${resetTarget.firstName} ${resetTarget.lastName}.`,
    });
  };

  return (
    <>
      <PageHeading
        title="User Management"
        subtitle="Manage users who have access to BanqueApp."
        action={
          <Button onClick={() => setFormModal({ mode: "create" })}>
            <Plus size={17} /> Add User
          </Button>
        }
      />

      <div className="stat-grid-4 user-management-kpis">
        <Metric label="Total Users" value={total} icon={<Users />} />
        <Metric label="Active Users" value={activeCount} icon={<UserCheck />} />
        <Metric label="Bank Agents" value={bankAgentCount} icon={<Briefcase />} />
        <Metric label="Administrators" value={adminCount} icon={<ShieldCheck />} />
      </div>

      <Card className="table-card">
        <div className="ct-toolbar">
          <div className="search compact">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="Search users…"
            />
          </div>
          <span className="results-count">
            {shown.length
              ? `Showing ${rangeStart}-${rangeEnd} of ${shown.length} users`
              : "No users found"}
          </span>
        </div>
        {shown.length ? (
          <>
            <UserTable
              users={pageItems}
              onView={setViewingUser}
              onEdit={(user) => setFormModal({ mode: "edit", user })}
              onToggleStatus={setStatusTarget}
              onResetPassword={setResetTarget}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              className="ct-pagination"
            />
          </>
        ) : users.length === 0 ? (
          <EmptyState
            title="No users found."
            detail="Create your first internal user to give them access to BanqueApp."
          />
        ) : (
          <EmptyState
            title="No users found"
            detail="Try adjusting your search."
          />
        )}
      </Card>

      {formModal && (
        <UserFormModal
          mode={formModal.mode}
          user={formModal.user}
          onClose={() => setFormModal(null)}
          onSaved={() => {
            const wasEditing = formModal.mode === "edit";
            setFormModal(null);
            reload();
            setSuccess({
              title: wasEditing
                ? "User Updated Successfully"
                : "User Created Successfully",
              message: wasEditing
                ? "The user's information has been successfully updated."
                : "The user can now access BanqueApp.",
            });
          }}
        />
      )}
      {viewingUser && (
        <UserProfileModal user={viewingUser} onClose={() => setViewingUser(null)} />
      )}
      {statusTarget && (
        <ConfirmationDialog
          title={
            statusTarget.status === "Active" ? "Deactivate User?" : "Activate User?"
          }
          message={
            statusTarget.status === "Active"
              ? "This user will no longer be able to access BanqueApp until their account is reactivated."
              : "This user will regain access to BanqueApp."
          }
          confirmLabel={statusTarget.status === "Active" ? "Deactivate" : "Activate"}
          confirmVariant={statusTarget.status === "Active" ? "danger" : "primary"}
          submitting={togglingStatus}
          onClose={closeStatusConfirm}
          onConfirm={confirmToggleStatus}
        />
      )}
      {resetTarget && (
        <ConfirmationDialog
          title="Reset Password?"
          message="A temporary password will be generated for this user."
          confirmLabel="Reset Password"
          submitting={resettingPassword}
          onClose={closeResetConfirm}
          onConfirm={confirmResetPassword}
        />
      )}
      {success && (
        <SuccessModal
          title={success.title}
          message={success.message}
          onClose={() => setSuccess(null)}
        />
      )}
    </>
  );
}
