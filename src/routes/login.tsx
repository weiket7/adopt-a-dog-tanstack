import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // formData.append("email", "");
    // formData.append("password", "");
    // formData.append("flow", "signUp");

    try {
      // "password" provider handles both email and password
      await signIn("password", formData);
      navigate({ to: "/admin/dogs" }); // Redirect after success
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container py-5 mt-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Admin Login</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} suppressHydrationWarning>
          <input name="flow" type="hidden" value="signIn" />
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              required
            />
          </div>
          {/* {error && <p className="text-danger small">{error}</p>} */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
