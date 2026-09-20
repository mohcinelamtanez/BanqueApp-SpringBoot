import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button, Input } from "../../components/ui";
import AuthLayout from "../../components/layout/AuthLayout";
import { authService } from "../../auth/authService";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await authService.register(email.trim(), password);
      setCreated(true);
    } catch (err) {
      setError(err.message || "Unable to create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <AuthLayout>
        <div className="confirmation">
          <span className="success-icon">
            <CheckCircle2 />
          </span>
          <h1>Account created</h1>
          <p>
            Your account for <b>{email}</b> has been created successfully.
            You can now sign in.
          </p>
          <div className="actions">
            <Link to="/login" className="btn primary">
              Continue to Sign In
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1>Create your BanqueApp account</h1>
      <p className="auth-subtitle">Sign up to access your banking dashboard.</p>
      <form className="auth-form" onSubmit={submit} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="field">
          <span>Password</span>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <Input
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <Button disabled={submitting}>
          {submitting && <LoaderCircle size={16} className="spin" />}
          {submitting ? "Creating account…" : "Create account"}
        </Button>
        <Link className="auth-footer-link" to="/login">
          Already have an account? Sign in
        </Link>
      </form>
    </AuthLayout>
  );
}
