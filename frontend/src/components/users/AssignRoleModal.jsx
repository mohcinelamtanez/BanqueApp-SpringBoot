import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button, Modal, Select } from "../ui";
import { userService } from "../../services/userService";
import { ROLE_LABEL } from "../../pages/userManagementShared";

// An Admin may only ever assign one of these two roles here — never Admin,
// which stays out of self-service user management (enforced again on the
// backend, not just hidden here).
const ASSIGNABLE_ROLES = ["BANK_AGENT", "CLIENT"];

export default function AssignRoleModal({ user, onClose, onSaved }) {
  const [role, setRole] = useState(
    ASSIGNABLE_ROLES.includes(user.role) ? user.role : ASSIGNABLE_ROLES[0],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const saved = await userService.assignRole(user.id, role);
      onSaved(saved);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Assign Role" onClose={submitting ? undefined : onClose}>
      <form className="stack-gap" onSubmit={submit}>
        <p className="decision-note">
          Choose the role for <b>{user.email}</b>.
        </p>
        <Select
          label="Role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          {ASSIGNABLE_ROLES.map((value) => (
            <option key={value} value={value}>
              {ROLE_LABEL[value] || value}
            </option>
          ))}
        </Select>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button disabled={submitting}>
            {submitting && <LoaderCircle size={16} className="spin" />}
            Save Role
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export { AssignRoleModal };
