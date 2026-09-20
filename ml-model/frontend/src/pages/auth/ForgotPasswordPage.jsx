import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button, Input } from "../../components/ui";
import AuthLayout from "../../components/layout/AuthLayout";
import { authService } from "../../auth/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    await authService.requestPasswordReset(email);
    setSubmitting(false);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="confirmation">
          <span className="success-icon">
            <CheckCircle2 />
          </span>
          <h1>Check your email</h1>
          <p>
            If an account exists for <b>{email}</b>, password-reset
            instructions have been sent.
          </p>
          <div className="actions">
            <Link to="/login" className="btn primary">
              Back to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1>Forgot your password?</h1>
      <p className="auth-subtitle">
        Enter your email and we'll send you instructions to reset your
        password.
      </p>
      <form className="auth-form" onSubmit={submit} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="username"
          value={email}
          error={error}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button disabled={submitting}>
          {submitting ? "Sending…" : "Send reset instructions"}
        </Button>
        <Link className="auth-footer-link" to="/login">
          Back to Login
        </Link>
      </form>
    </AuthLayout>
  );
}
