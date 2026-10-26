import { useCallback, useEffect, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api/admin";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = useCallback(async (isRefresh = false) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Login token nahi mila. Please dobara login karein.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session invalid ya expire ho gaya. Dobara login karein.");
        }

        if (response.status === 403) {
          throw new Error("Admin access required. Is account ka role admin hona chahiye.");
        }

        throw new Error(data.message || "Users fetch nahi ho sake.");
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message || "Server se connection nahi ho saka.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";

    const confirmed = window.confirm(
      `Kya aap ${user.name || user.email} ka role "${newRole}" karna chahte hain?`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Login token nahi mila. Please dobara login karein.");
      return;
    }

    setUpdatingId(user._id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/users/${user._id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session invalid ya expire ho gaya. Dobara login karein.");
        }

        if (response.status === 403) {
          throw new Error("Sirf admin users ka role change kar sakta hai.");
        }

        throw new Error(data.message || "User role update nahi ho saka.");
      }

      // Update the user in local state without reloading the page.
      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, ...data.user }
            : item
        )
      );

      setSuccess(data.message || "User role successfully update ho gaya.");
    } catch (err) {
      console.error("Update user role error:", err);
      setError(err.message || "Server se connection nahi ho saka.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      (user.name || "").toLowerCase().includes(searchText) ||
      (user.email || "").toLowerCase().includes(searchText) ||
      (user.role || "user").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage Users
          </h1>

          <p className="mt-2 text-slate-500">
            View registered users and manage their roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Users"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FiUsers size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? "..." : users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <FiShield size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Administrators</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : users.filter((user) => user.role === "admin").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FiUser size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Regular Users</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading
                  ? "..."
                  : users.filter((user) => user.role !== "admin").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <FiCheckCircle className="mt-0.5 shrink-0" size={18} />
          <p>{success}</p>
        </div>
      )}

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Users
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredUsers.length} user(s) found
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:w-72">
            <FiSearch className="shrink-0 text-slate-400" size={18} />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, role..."
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
              <p className="mt-3 text-sm text-slate-500">
                Loading users...
              </p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FiUsers className="mx-auto text-slate-300" size={36} />
            <p className="mt-3 font-semibold text-slate-700">
              No users found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Total Tasks</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                          {(user.name || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name || "Unnamed user"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-violet-50 text-violet-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <FiShield size={14} />
                        ) : (
                          <FiUser size={14} />
                        )}
                        {user.role || "user"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold text-slate-700">
                        {user.totalTasks ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRoleChange(user)}
                        disabled={updatingId === user._id}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          user.role === "admin"
                            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {updatingId === user._id
                          ? "Updating..."
                          : user.role === "admin"
                            ? "Make User"
                            : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;