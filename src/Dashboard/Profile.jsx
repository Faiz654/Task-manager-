
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiSave,
  FiLoader,
} from "react-icons/fi";

const API_URL = "/api/users";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
};

const emptyPasswords = {
  current: "",
  newPassword: "",
  confirm: "",
};

function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [passwords, setPasswords] = useState(emptyPasswords);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again.");
        }

        const response = await fetch(`${API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          bio: data.user.bio || "",
        });
      } catch (error) {
        toast.error(error.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (savingProfile) return;

    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    setSavingProfile(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed.");
      }

      // Keep the saved profile data visible
      if (data.user) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          bio: data.user.bio || "",
        });
      }

      toast.success(data.message || "Profile saved successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      toast.error(error.message || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Update password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (savingPassword) return;

    if (
      !passwords.current.trim() ||
      !passwords.newPassword ||
      !passwords.confirm
    ) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    if (passwords.current === passwords.newPassword) {
      toast.error(
        "New password must differ from your current password."
      );
      return;
    }

    setSavingPassword(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(`${API_URL}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Password update failed (${response.status}).`
        );
      }

      setPasswords({ ...emptyPasswords });

      toast.success(
        data.message || "Password updated successfully!",
        {
          duration: 3000,
          position: "top-right",
        }
      );
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

  const labelClass = "text-sm font-semibold text-slate-700";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-violet-600">
        <FiLoader className="animate-spin" size={24} />
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-violet-600">
            Account Settings
          </p>

          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-slate-500">
            Manage your personal information and account security.
          </p>
        </div>

        {/* Personal Information */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <FiUser size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your profile details.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleProfileSubmit}
            className="space-y-6 p-6 sm:p-8"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>

                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>

                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleProfileChange}
                    placeholder="Enter your location"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bio" className={labelClass}>
                  About Me
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  placeholder="Write a short introduction..."
                  rows={4}
                  maxLength={300}
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {profile.bio.length}/300 characters
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {savingProfile ? (
                  <FiLoader className="animate-spin" size={17} />
                ) : (
                  <FiSave size={17} />
                )}

                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        {/* Change Password */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <FiLock size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Change Password
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-6 p-6 sm:p-8"
          >
            <div>
              <label htmlFor="current" className={labelClass}>
                Current Password
              </label>

              <input
                id="current"
                name="current"
                type="password"
                autoComplete="current-password"
                value={passwords.current}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className={inputClass}
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="newPassword" className={labelClass}>
                  New Password
                </label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 8 characters"
                  className={inputClass}
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm" className={labelClass}>
                  Confirm New Password
                </label>

                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Re-enter new password"
                  className={inputClass}
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {savingPassword ? (
                  <FiLoader className="animate-spin" size={17} />
                ) : (
                  <FiLock size={16} />
                )}

                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>

        {/* Account Overview */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">
            Account Overview
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Account Name</p>
              <p className="mt-1 break-words font-semibold text-slate-800">
                {profile.name || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="mt-1 break-words font-semibold text-slate-800">
                {profile.email || "Not provided"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
