import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Frontend-only preference — never sent to the API. Imported as a
// side-effect from ClientLayout.jsx, so it only initializes when the
// Client experience actually mounts (Admin never touches it).
export const LANGUAGE_STORAGE_KEY = "banqueapp.client.lang";

const isBrowser = typeof window !== "undefined";
function readStoredLanguage() {
  if (!isBrowser) return "en";
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
  } catch {
    return "en";
  }
}

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: "Dashboard",
        profile: "My Profile",
        loans: "My Loans",
        applications: "My Applications",
        payments: "My Payments",
        settings: "Settings",
        logout: "Logout",
      },
      topbar: {
        searchPlaceholder: "Search…",
        notifications: "Notifications",
      },
      settings: {
        title: "Settings",
        subtitle: "Manage your account preferences.",
        accountPreferences: "Account Preferences",
        language: "Language",
        languageHint: "Choose the language used across your client portal.",
        security: "Security",
        changePasswordTitle: "Change Password",
        changePasswordDesc:
          "Update your account password to keep your account secure.",
        changePasswordAction: "Change Password",
        twoFATitle: "Two-Factor Authentication",
        twoFADesc: "Add an extra layer of security to your account.",
        status: "Status",
        statusDisabled: "Disabled",
        statusEnabled: "Enabled",
        enable: "Enable",
        disable: "Disable",
        appearance: "Appearance",
        appearanceSubtitle: "Choose how BanqueApp looks for you.",
        themeLight: "Light",
        themeLightDesc: "Clean, bright interface.",
        themeDark: "Dark",
        themeDarkDesc: "Easier on the eyes at night.",
        themeSystem: "System",
        themeSystemDesc: "Match your device settings.",
      },
      passwordModal: {
        title: "Change Password",
        current: "Current Password",
        next: "New Password",
        confirm: "Confirm New Password",
        cancel: "Cancel",
        submit: "Update Password",
        submitting: "Updating…",
        successTitle: "Password Updated Successfully",
        successMessage: "Your password has been changed.",
        errorMismatch: "New password and confirmation do not match.",
        errorRequired: "All fields are required.",
        errorLength: "New password must be at least 8 characters.",
      },
      twoFactorModal: {
        title: "Enable Two-Factor Authentication",
        description:
          "Protect your account with an additional verification step when signing in.",
        enable: "Enable 2FA",
        cancel: "Cancel",
        successTitle: "Two-Factor Authentication Enabled",
        successMessage:
          "Your account now requires a verification step at sign-in.",
      },
    },
  },
  fr: {
    translation: {
      nav: {
        dashboard: "Tableau de bord",
        profile: "Mon profil",
        loans: "Mes prêts",
        applications: "Mes demandes",
        payments: "Mes paiements",
        settings: "Paramètres",
        logout: "Déconnexion",
      },
      topbar: {
        searchPlaceholder: "Rechercher…",
        notifications: "Notifications",
      },
      settings: {
        title: "Paramètres",
        subtitle: "Gérez les préférences de votre compte.",
        accountPreferences: "Préférences du compte",
        language: "Langue",
        languageHint: "Choisissez la langue utilisée dans votre espace client.",
        security: "Sécurité",
        changePasswordTitle: "Changer le mot de passe",
        changePasswordDesc:
          "Mettez à jour votre mot de passe pour sécuriser votre compte.",
        changePasswordAction: "Changer le mot de passe",
        twoFATitle: "Authentification à deux facteurs",
        twoFADesc:
          "Ajoutez une couche de sécurité supplémentaire à votre compte.",
        status: "Statut",
        statusDisabled: "Désactivée",
        statusEnabled: "Activée",
        enable: "Activer",
        disable: "Désactiver",
        appearance: "Apparence",
        appearanceSubtitle: "Choisissez l'apparence de BanqueApp.",
        themeLight: "Clair",
        themeLightDesc: "Interface claire et épurée.",
        themeDark: "Sombre",
        themeDarkDesc: "Plus reposant pour les yeux le soir.",
        themeSystem: "Système",
        themeSystemDesc: "Suit les réglages de votre appareil.",
      },
      passwordModal: {
        title: "Changer le mot de passe",
        current: "Mot de passe actuel",
        next: "Nouveau mot de passe",
        confirm: "Confirmer le nouveau mot de passe",
        cancel: "Annuler",
        submit: "Mettre à jour",
        submitting: "Mise à jour…",
        successTitle: "Mot de passe mis à jour",
        successMessage: "Votre mot de passe a été modifié.",
        errorMismatch: "Le nouveau mot de passe et la confirmation ne correspondent pas.",
        errorRequired: "Tous les champs sont obligatoires.",
        errorLength: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      },
      twoFactorModal: {
        title: "Activer l'authentification à deux facteurs",
        description:
          "Protégez votre compte avec une étape de vérification supplémentaire lors de la connexion.",
        enable: "Activer la 2FA",
        cancel: "Annuler",
        successTitle: "Authentification à deux facteurs activée",
        successMessage:
          "Votre compte nécessite désormais une étape de vérification à la connexion.",
      },
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: readStoredLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
