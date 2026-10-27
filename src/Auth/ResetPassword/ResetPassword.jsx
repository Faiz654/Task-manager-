
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";

const API_URL = "/api/auth";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset link is invalid. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/reset-password/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password."
        );
      }

      setSuccess(
        data.message || "Password reset successfully. Please log in."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold text-indigo-600"
        >
          TaskManager.
        </Link>

        {/* Icon */}
        <div className="mt-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <FiLock size={26} />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Reset password
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Create a new password for your account. Choose a password
          with at least 6 characters.
        </p>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <FiAlertCircle size={20} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            role="status"
            className="mt-6 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <FiCheckCircle size={20} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {/* New Password */}
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              New password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
              <FiLock className="shrink-0 text-slate-400" />

              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                minLength={6}
                required
                disabled={loading || Boolean(success)}
                className="w-full py-3.5 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="text-slate-400 hover:text-indigo-600"
              >
                {showPassword ? (
                  <FiEyeOff size={19} />
                ) : (
                  <FiEye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm new password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
              <FiLock className="shrink-0 text-slate-400" />

              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                autoComplete="new-password"
                minLength={6}
                required
                disabled={loading || Boolean(success)}
                className="w-full py-3.5 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="text-slate-400 hover:text-indigo-600"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={19} />
                ) : (
                  <FiEye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || Boolean(success)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Resetting password..."
              : success
                ? "Password reset successful"
                : "Reset password"}
          </button>
        </form>

        {/* Back to Login */}
        <Link
          to="/login"
          className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <FiArrowLeft />
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;
