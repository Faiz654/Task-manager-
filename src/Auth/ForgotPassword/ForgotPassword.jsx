
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

const API_URL = "/api/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitted(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to process your request."
        );
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-indigo-600">
          TaskManager.
        </Link>

        {/* Icon */}
        <div className="mt-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <FiMail size={26} />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Forgot password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          No worries! Enter the email address associated with your
          account. If an account exists, we'll send you a password
          reset link.
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
        {submitted ? (
          <div
            role="status"
            className="mt-7 rounded-xl border border-green-100 bg-green-50 p-4"
          >
            <div className="flex items-center gap-2 font-semibold text-green-700">
              <FiCheckCircle size={20} />
              Request received
            </div>

            <p className="mt-2 text-sm leading-6 text-green-700">
              If an account exists for this email, a password reset
              link will be sent. Please check your inbox and spam
              folder.
            </p>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setError("");
              }}
              className="mt-3 text-sm font-semibold text-green-800 underline"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="reset-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <FiMail className="shrink-0 text-slate-400" />

                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="w-full py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Sending reset link...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
        )}

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

export default ForgotPassword;
