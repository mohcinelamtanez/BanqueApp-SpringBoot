import { Badge, Modal } from "../ui";
import { date } from "../../utils/finance";
import { initials } from "../../pages/pageShared";
import { ROLE_LABEL, formatLastLogin } from "../../pages/userManagementShared";

export default function UserProfileModal({ user, onClose }) {
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <Modal title="User Profile" onClose={onClose}>
      <div className="profile-heading user-profile-modal-heading">
        <span className="avatar profile-avatar">{initials(fullName)}</span>
        <div>
          <h3>{fullName}</h3>
          <Badge type={user.role === "ADMIN" ? "role-admin" : ""}>
            {ROLE_LABEL[user.role] || user.role}
          </Badge>
        </div>
      </div>
      <div className="decision-recap">
        <div className="decision-recap-row">
          <span>Email</span>
          <b>{user.email}</b>
        </div>
        <div className="decision-recap-row">
          <span>Phone</span>
          <b>{user.phone}</b>
        </div>
        <div className="decision-recap-row">
          <span>Role</span>
          <b>{ROLE_LABEL[user.role] || user.role}</b>
        </div>
        <div className="decision-recap-row">
          <span>Status</span>
          <Badge type={user.status === "Active" ? "active" : ""}>
            {user.status}
          </Badge>
        </div>
        <div className="decision-recap-row">
          <span>Last Login</span>
          <b>{formatLastLogin(user.lastLogin)}</b>
        </div>
        <div className="decision-recap-row">
          <span>Created</span>
          <b>{date(user.createdAt)}</b>
        </div>
      </div>
    </Modal>
  );
}
export { UserProfileModal };
