import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // SAVE LOGIN AND REDIRECT
  // ==========================================

  const saveLoginAndRedirect = (data) => {
    if (!data?.token || !data?.user) {
      setError("Login response mein token ya user data nahi mila.");
      return;
    }

    if (!["admin", "user"].includes(data.user.role)) {
      setError("User role missing ya invalid hai.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setEmail("");
    setPassword("");
    setShowPassword(false);
    setError("");

    if (data.user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/user-dashboard", { replace: true });
    }
  };

  // ==========================================
  // EMAIL / PASSWORD LOGIN
  // POST /api/auth/login
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      saveLoginAndRedirect(data);
    } catch (err) {
      console.error("Email login error:", err);
      setError(
        "Server se connection nahi ho saka. Backend check karein."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE LOGIN
  // POST /api/auth/google
  // ==========================================

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    if (!credentialResponse?.credential) {
      setError("Google credential receive nahi hua.");
      return;
    }

    setGoogleLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Google login failed.");
        return;
      }

      saveLoginAndRedirect(data);
    } catch (err) {
      console.error("Google login error:", err);

      setError(
        "Google login ke liye backend se connection nahi ho saka."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Left section */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-800 p-10 text-white md:flex">
          <Link to="/" className="text-2xl font-bold">
            Task Manager<span className="text-indigo-200">.</span>
          </Link>

          <div>
            <h1 className="mb-5 text-4xl font-bold leading-tight">
              Organize your work.
              <br />
              Achieve your goals.
            </h1>

            <p className="max-w-sm leading-7 text-indigo-100">
              Plan your day, stay focused, and get more done with
              your personal task management workspace.
            </p>
          </div>

          <p className="text-sm text-indigo-200">
            Stay organized. Stay productive.
          </p>
        </div>

        {/* Login form */}
        <div className="px-6 py-10 sm:px-10 md:px-12">
          <Link
            to="/"
            className="mb-8 inline-block text-xl font-bold text-indigo-600 md:hidden"
          >
            Task Manager.
          </Link>

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Log in to your account
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Enter your details to access your workspace.
            </p>
          </div>

          {/* Google Login */}
          <div className="flex w-full justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError(
                  "Google authentication failed. Dobara try karein."
                );
              }}
              text="continue_with"
              theme="outline"
              shape="rectangular"
              width="320"
              useOneTap={false}
            />
          </div>

          {googleLoading && (
            <p className="mt-3 text-center text-sm text-indigo-600">
              Google login ho raha hai...
            </p>
          )}

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs text-slate-400">
              OR CONTINUE WITH EMAIL
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
            autoComplete="off"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <FiMail className="text-slate-400" size={19} />

                <input
                  id="email"
                  name="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <FiLock className="text-slate-400" size={19} />

                <input
                  id="password"
                  name="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent py-3.5 text-sm text-slate-800 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-indigo-600"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Email login button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
              {!loading && <FiArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
