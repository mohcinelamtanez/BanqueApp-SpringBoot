import { useRef, useState } from "react";
import { IdCard, Mail, MapPin } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  LoadingState,
  SuccessModal,
} from "../../components/ui";
import ClientAvatar from "../../components/clients/ClientAvatar";
import ClientForm from "../../components/clients/ClientForm";
import ClientFormModal from "../../components/clients/ClientFormModal";
import { useMyClient } from "../../hooks/useClients";
import { clientService } from "../../services/clientService";
import { getUser, setUser } from "../../auth/authStore";
import { money } from "../../utils/finance";
import { initials, PageHeading } from "../pageShared";

const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export default function ClientProfilePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { loading, data: client } = useMyClient(refreshKey);
  const [editOpen, setEditOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Local preview shown while an upload is in flight — never persisted,
  // and always discarded (in favor of the real stored photo, or the prior
  // one on failure) once the request settles.
  const [localPreview, setLocalPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  if (loading) return <LoadingState />;

  // No Client linked to this User yet (e.g. a freshly registered account) —
  // show the profile fields directly so the first save creates the Client
  // and links it, instead of a separate "Setup Profile" page/route. A photo
  // can only be attached once the Client exists (see the upload endpoint),
  // so it isn't offered here.
  if (!client) {
    const createProfile = async (values) => {
      setCreateError("");
      setCreating(true);
      try {
        const saved = await clientService.saveMine(values);
        // Keeps the rest of the Client portal (My Loans/Applications/
        // Payments, all keyed off authStore's clientReference) working
        // immediately, without requiring the user to log out and back in.
        setUser({ ...getUser(), clientReference: saved.reference });
        setRefreshKey((value) => value + 1);
      } catch (err) {
        setCreateError(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } finally {
        setCreating(false);
      }
    };

    return (
      <>
        <PageHeading
          title="My Profile"
          subtitle="Complete your profile to get started."
        />
        <Card>
          <h2>Complete your profile</h2>
          <p>
            We need a few details before you can apply for a loan or view
            your account.
          </p>
          <ClientForm formId="my-profile-form" onSubmit={createProfile} />
          {createError && <p className="error">{createError}</p>}
          <div className="actions">
            <Button type="submit" form="my-profile-form" disabled={creating}>
              {creating ? "Saving…" : "Save Profile"}
            </Button>
          </div>
        </Card>
      </>
    );
  }

  const validatePhotoFile = (file) => {
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      return "Only JPEG, PNG or WEBP images are supported.";
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      return "Image must be 5MB or smaller.";
    }
    return "";
  };

  const choosePhoto = () => fileInputRef.current?.click();

  const onPhotoSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setPhotoError("");
    const validationError = validatePhotoFile(file);
    if (validationError) {
      setPhotoError(validationError);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setUploadingPhoto(true);
    try {
      await clientService.uploadMyPhoto(file);
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setPhotoError(
        err.response?.data?.message ||
          "Could not upload your photo. Please try again.",
      );
    } finally {
      setUploadingPhoto(false);
      URL.revokeObjectURL(previewUrl);
      setLocalPreview(null);
    }
  };

  const removePhoto = async () => {
    setPhotoError("");
    setUploadingPhoto(true);
    try {
      await clientService.removeMyPhoto();
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setPhotoError(
        err.response?.data?.message ||
          "Could not remove your photo. Please try again.",
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <>
      <PageHeading
        title="My Profile"
        subtitle="View and manage your personal information."
      />
      <div className="profile card">
        <div className="profile-heading">
          <div className="profile-avatar-upload">
            {localPreview ? (
              <img
                src={localPreview}
                alt=""
                className="avatar profile-avatar"
              />
            ) : (
              <ClientAvatar
                profilePhotoUrl={client.profilePhotoUrl}
                initials={initials(client.name)}
                className="avatar profile-avatar"
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_PHOTO_TYPES.join(",")}
              hidden
              onChange={onPhotoSelected}
            />
            <div className="profile-avatar-actions">
              <Button
                variant="secondary"
                type="button"
                onClick={choosePhoto}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto
                  ? "Uploading…"
                  : client.profilePhotoUrl
                    ? "Change Photo"
                    : "Upload Photo"}
              </Button>
              {client.profilePhotoUrl && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={removePhoto}
                  disabled={uploadingPhoto}
                >
                  Remove Photo
                </Button>
              )}
            </div>
            {photoError && <p className="error">{photoError}</p>}
          </div>
          <div>
            <h1>{client.name}</h1>
            <p className="profile-role">
              <Badge>Client</Badge>
            </p>
            <div className="profile-meta">
              <div className="profile-meta-row mono">
                <span className="profile-meta-item">
                  <IdCard size={14} />
                  {client.id}
                </span>
                <span className="profile-meta-item">
                  <MapPin size={14} />
                  {client.city}, Morocco
                </span>
              </div>
              <div className="profile-meta-row profile-meta-email mono">
                <span className="profile-meta-item">
                  <Mail size={14} />
                  {client.email}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="actions">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="detail-grid">
        <Card>
          <h2>Personal Information</h2>
          <dl>
            <dt>First Name</dt>
            <dd>{client.firstName}</dd>
            <dt>Last Name</dt>
            <dd>{client.lastName || "—"}</dd>
            <dt>Email</dt>
            <dd>{client.email}</dd>
          </dl>
        </Card>
        <Card>
          <h2>Address</h2>
          <dl>
            <dt>City</dt>
            <dd>{client.city}</dd>
            <dt>Postal Code</dt>
            <dd>{client.postalCode || "—"}</dd>
          </dl>
        </Card>
      </div>

      <Card>
        <h2>Financial Information</h2>
        <dl>
          <dt>Annual Revenue</dt>
          <dd>{money(client.income)} / year</dd>
        </dl>
      </Card>

      {editOpen && (
        <ClientFormModal
          mode="edit"
          client={client}
          own
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false);
            setShowSuccess(true);
            setRefreshKey((value) => value + 1);
          }}
        />
      )}
      {showSuccess && (
        <SuccessModal
          title="Profile Updated Successfully"
          message="Your profile information has been updated."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
