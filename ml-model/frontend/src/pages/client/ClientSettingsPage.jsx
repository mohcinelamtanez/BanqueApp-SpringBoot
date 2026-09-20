import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Globe, Monitor, Moon, Palette, ShieldCheck, Sun } from "lucide-react";
import { Badge, Button, Card, Select, SuccessModal } from "../../components/ui";
import ChangePasswordModal from "../../components/settings/ChangePasswordModal";
import TwoFactorModal from "../../components/settings/TwoFactorModal";
import { PageHeading } from "../pageShared";
import { useClientTheme } from "./ClientThemeContext";
import { LANGUAGE_STORAGE_KEY } from "../../i18n";

const TWO_FA_STORAGE_KEY = "banqueapp.client.2fa";
const isBrowser = typeof window !== "undefined";
function readTwoFactorEnabled() {
  if (!isBrowser) return false;
  try {
    return window.localStorage.getItem(TWO_FA_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}
function writeTwoFactorEnabled(value) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(TWO_FA_STORAGE_KEY, String(value));
  } catch {
    /* ignore write failures */
  }
}

export default function ClientSettingsPage() {
  const { t, i18n } = useTranslation();
  const { preference, setPreference } = useClientTheme();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(readTwoFactorEnabled);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [success, setSuccess] = useState(null);

  const changeLanguage = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    if (isBrowser) {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } catch {
        /* ignore write failures */
      }
    }
  };

  const themeOptions = [
    { value: "light", icon: Sun, label: t("settings.themeLight"), desc: t("settings.themeLightDesc") },
    { value: "dark", icon: Moon, label: t("settings.themeDark"), desc: t("settings.themeDarkDesc") },
    { value: "system", icon: Monitor, label: t("settings.themeSystem"), desc: t("settings.themeSystemDesc") },
  ];

  return (
    <>
      <PageHeading title={t("settings.title")} subtitle={t("settings.subtitle")} />

      <div className="stack-gap">
        <Card>
          <h2 className="icon-heading">
            <Globe size={18} /> {t("settings.accountPreferences")}
          </h2>
          <div className="form-grid">
            <Select
              label={t("settings.language")}
              value={i18n.resolvedLanguage || i18n.language}
              onChange={changeLanguage}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </Select>
          </div>
          <p className="decision-note">{t("settings.languageHint")}</p>
        </Card>

        <Card>
          <h2 className="icon-heading">
            <ShieldCheck size={18} /> {t("settings.security")}
          </h2>
          <div className="stack-gap">
            <div className="decision-option">
              <div>
                <h3>{t("settings.changePasswordTitle")}</h3>
                <p>{t("settings.changePasswordDesc")}</p>
              </div>
              <Button onClick={() => setPasswordModalOpen(true)}>
                {t("settings.changePasswordAction")}
              </Button>
            </div>
            <div className="decision-option">
              <div>
                <h3>{t("settings.twoFATitle")}</h3>
                <p>{t("settings.twoFADesc")}</p>
                <div className="settings-status-line">
                  <span>{t("settings.status")}</span>
                  <Badge type={twoFactorEnabled ? "active" : ""}>
                    {twoFactorEnabled
                      ? t("settings.statusEnabled")
                      : t("settings.statusDisabled")}
                  </Badge>
                </div>
              </div>
              {twoFactorEnabled ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setTwoFactorEnabled(false);
                    writeTwoFactorEnabled(false);
                  }}
                >
                  {t("settings.disable")}
                </Button>
              ) : (
                <Button onClick={() => setTwoFactorModalOpen(true)}>
                  {t("settings.enable")}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="icon-heading">
            <Palette size={18} /> {t("settings.appearance")}
          </h2>
          <p className="decision-note">{t("settings.appearanceSubtitle")}</p>
          <div className="theme-options">
            {themeOptions.map(({ value, icon: Icon, label, desc }) => (
              <button
                key={value}
                type="button"
                className={`theme-option-card${preference === value ? " selected" : ""}`}
                onClick={() => setPreference(value)}
              >
                {preference === value && (
                  <Check size={16} className="theme-option-check" />
                )}
                <Icon size={20} />
                <b>{label}</b>
                <span>{desc}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {passwordModalOpen && (
        <ChangePasswordModal
          onClose={() => setPasswordModalOpen(false)}
          onUpdated={() => {
            setPasswordModalOpen(false);
            setSuccess({
              title: t("passwordModal.successTitle"),
              message: t("passwordModal.successMessage"),
            });
          }}
        />
      )}
      {twoFactorModalOpen && (
        <TwoFactorModal
          onClose={() => setTwoFactorModalOpen(false)}
          onEnabled={() => {
            setTwoFactorModalOpen(false);
            setTwoFactorEnabled(true);
            writeTwoFactorEnabled(true);
            setSuccess({
              title: t("twoFactorModal.successTitle"),
              message: t("twoFactorModal.successMessage"),
            });
          }}
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
