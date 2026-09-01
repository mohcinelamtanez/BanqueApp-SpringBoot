import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, Modal } from "../ui";

export default function ChangePasswordModal({ onClose, onUpdated }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const change = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.current || !form.next || !form.confirm) {
      return setError(t("passwordModal.errorRequired"));
    }
    if (form.next.length < 8) {
      return setError(t("passwordModal.errorLength"));
    }
    if (form.next !== form.confirm) {
      return setError(t("passwordModal.errorMismatch"));
    }
    setError("");
    setSubmitting(true);
    // Frontend-only simulation — no backend/API call. See task scope.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onUpdated();
  };

  return (
    <Modal
      title={t("passwordModal.title")}
      onClose={submitting ? undefined : onClose}
    >
      <form className="stack-gap" onSubmit={submit}>
        <Input
          label={t("passwordModal.current")}
          type="password"
          autoComplete="current-password"
          value={form.current}
          onChange={change("current")}
        />
        <Input
          label={t("passwordModal.next")}
          type="password"
          autoComplete="new-password"
          value={form.next}
          onChange={change("next")}
        />
        <Input
          label={t("passwordModal.confirm")}
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={change("confirm")}
        />
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={submitting}
          >
            {t("passwordModal.cancel")}
          </Button>
          <Button disabled={submitting}>
            {submitting ? t("passwordModal.submitting") : t("passwordModal.submit")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export { ChangePasswordModal };
