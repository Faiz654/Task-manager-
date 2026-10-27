
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      setMessage(data.message || "Account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);

      // Redirect to Login after successful signup
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please try again."
          : err.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* Left panel */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-800 p-10 text-white md:flex">
          <Link to="/" className="text-2xl font-extrabold">
            TaskManager.
          </Link>

          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Make every day
              <br />
              more productive.
            </h1>

            <p className="mt-5 max-w-sm leading-7 text-indigo-100">
              Create your account and bring all your tasks into
              one organized workspace.
            </p>
          </div>

          <p className="text-sm text-indigo-200">
            Plan better. Achieve more.
          </p>
        </div>

        {/* Signup form */}
        <div className="px-6 py-10 sm:px-10 md:px-12">
          <Link
            to="/"
            className="text-xl font-extrabold text-indigo-600 md:hidden"
          >
            TaskManager.
          </Link>

          <div className="mt-6 md:mt-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Get started for free
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Create your account
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Fill in your details to get started.
            </p>
          </div>

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <FiUser className="text-slate-400" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <FiMail className="text-slate-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <FiLock className="text-slate-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3.5 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Success message */}
            {message && (
              <p
                role="status"
                className="rounded-xl bg-green-50 p-3 text-sm text-green-700"
              >
                {message}
              </p>
            )}

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
