import { useEffect, useState } from "react";
import { clientService } from "../../services/clientService";

// Renders a Client's avatar: the uploaded photo when one exists, otherwise
// the initials fallback. Profile photos are served through an authenticated
// endpoint (never public — see SpringSecurityConfig's "/api/uploads/**"
// rule), so a plain `<img src={profilePhotoUrl}>` can't load them; this
// fetches the bytes through the normal JWT-bearing httpClient and displays
// them via a local object URL instead. Used by both "My Profile" and Admin
// Client Management, so Admin sees the exact same centrally-stored image.
export default function ClientAvatar({
  profilePhotoUrl,
  initials,
  className = "avatar",
}) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!profilePhotoUrl) {
      setBlobUrl(null);
      return;
    }
    let active = true;
    let objectUrl = null;
    clientService
      .fetchPhotoBlobUrl(profilePhotoUrl)
      .then((url) => {
        if (!active) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setBlobUrl(url);
      })
      .catch(() => {
        if (active) setBlobUrl(null);
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [profilePhotoUrl]);

  if (blobUrl) {
    return <img src={blobUrl} alt="" className={className} />;
  }
  return <span className={className}>{initials}</span>;
}
export { ClientAvatar };
