import { useEffect, useRef, useState } from "react";
import { Eye, KeyRound, Pencil, Power, MoreVertical } from "lucide-react";

export default function UserActionsMenu({
  user,
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);
  const isActive = user.status === "Active";
  return (
    <div className="actions-cell" ref={ref}>
      <button
        type="button"
        className={open ? "actions-btn open" : "actions-btn"}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${user.firstName} ${user.lastName}`}
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="actions-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onView(user);
            }}
          >
            <Eye size={18} />
            View Profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit(user);
            }}
          >
            <Pencil size={18} />
            Edit User
          </button>
          <div className="actions-menu-divider" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onToggleStatus(user);
            }}
          >
            <Power size={18} />
            {isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onResetPassword(user);
            }}
          >
            <KeyRound size={18} />
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
export { UserActionsMenu };
