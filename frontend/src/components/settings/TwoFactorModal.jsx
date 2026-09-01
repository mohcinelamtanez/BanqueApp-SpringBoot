import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { Button, Modal } from "../ui";

export default function TwoFactorModal({ onClose, onEnabled }) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const enable = async () => {
    setSubmitting(true);
    // Frontend-only simulation — no OTP/QR generation, no backend call.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onEnabled();
  };

  return (
    <Modal
      title={t("twoFactorModal.title")}
      onClose={submitting ? undefined : onClose}
    >
      <div className="confirmation">
        <span className="success-icon">
          <ShieldCheck />
        </span>
        <p>{t("twoFactorModal.description")}</p>
        <div className="actions">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {t("twoFactorModal.cancel")}
          </Button>
          <Button onClick={enable} disabled={submitting}>
            {t("twoFactorModal.enable")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export { TwoFactorModal };
