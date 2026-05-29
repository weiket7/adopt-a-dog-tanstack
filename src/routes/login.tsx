import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import * as React from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin/dogs" });
    }
  }, [isAuthenticated, navigate]);

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch {
      setMsg("Wrong email and/or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-sheet">
        <div className="login-body">
          <h2 id="login-title">Welcome back.</h2>
          <p className="login-sub">
            Sign in to manage your fosters, volunteer shifts and adoption
            applications.
          </p>
          <form onSubmit={submit} className="login-form">
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                required
              />
            </label>
            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
            <div className="login-row">
              <label className="login-remember">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a
                href="#"
                className="login-link"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="login-submit"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
            {msg && <div className="login-msg">{msg}</div>}
            <p className="login-foot">
              No account yet?{" "}
              <a
                href="#"
                className="login-link"
                onClick={(e) => e.preventDefault()}
              >
                Get in touch with us
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
