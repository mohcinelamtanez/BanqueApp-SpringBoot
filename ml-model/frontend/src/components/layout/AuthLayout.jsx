import { Landmark } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <div className="auth-brand">
          <Landmark size={28} />
          <span>BanqueApp</span>
        </div>
        {children}
      </div>
    </div>
  );
}
export { AuthLayout };
