import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCheckSquare,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiFilter,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api/admin";

function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visibilityFilter, setVisibilityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTasks = useCallback(async (isRefresh = false) => {
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
      const response = await fetch(`${API_URL}/tasks`, {
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

        throw new Error(data.message || "Tasks fetch nahi ho sake.");
      }

      setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    } catch (err) {
      console.error("Fetch admin tasks error:", err);
      setError(err.message || "Server se connection nahi ho saka.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleVisibilityChange = async (task) => {
    const newIsHidden = task.isHidden !== true;
    const action = newIsHidden ? "hide" : "unhide";

    const confirmed = window.confirm(
      `Kya aap "${task.title}" task ko ${action} karna chahte hain? Task delete nahi hoga.`
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Login token nahi mila. Please dobara login karein.");
      return;
    }

    setUpdatingId(task._id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/tasks/${task._id}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isHidden: newIsHidden,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session invalid ya expire ho gaya. Dobara login karein.");
        }

        if (response.status === 403) {
          throw new Error("Sirf admin task hide ya unhide kar sakta hai.");
        }

        throw new Error(data.message || "Task visibility update nahi ho saki.");
      }

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item._id === task._id
            ? { ...item, ...data.task }
            : item
        )
      );

      setSuccess(
        data.message ||
          (newIsHidden
            ? "Task successfully hidden."
            : "Task successfully unhidden.")
      );
    } catch (err) {
      console.error("Update task visibility error:", err);
      setError(err.message || "Server se connection nahi ho saka.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        (task.title || "").toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query) ||
        (task.user?.name || "").toLowerCase().includes(query) ||
        (task.user?.email || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const isHidden = task.isHidden === true;

      const matchesVisibility =
        visibilityFilter === "All" ||
        (visibilityFilter === "Hidden" && isHidden) ||
        (visibilityFilter === "Visible" && !isHidden);

      return matchesSearch && matchesStatus && matchesVisibility;
    });
  }, [tasks, search, statusFilter, visibilityFilter]);

  const hiddenCount = tasks.filter(
    (task) => task.isHidden === true
  ).length;

  const visibleCount = tasks.length - hiddenCount;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage Tasks
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage tasks created by all users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchTasks(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Tasks"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FiCheckSquare size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? "..." : tasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FiEye size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Visible Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? "..." : visibleCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FiEyeOff size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Hidden Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
                {loading ? "..." : hiddenCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* API feedback */}
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

      {/* Tasks table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All Tasks
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredTasks.length} task(s) found
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
              <FiSearch className="shrink-0 text-slate-400" size={18} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search task or owner..."
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4">
              <FiFilter className="shrink-0 text-slate-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-transparent py-3 text-sm outline-none"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="All">All visibility</option>
              <option value="Visible">Visible only</option>
              <option value="Hidden">Hidden only</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
              <p className="mt-3 text-sm text-slate-500">
                Loading tasks...
              </p>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FiCheckSquare className="mx-auto text-slate-300" size={36} />
            <p className="mt-3 font-semibold text-slate-700">
              No tasks found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Task</th>
                  <th className="px-5 py-4 font-semibold">Owner</th>
                  <th className="px-5 py-4 font-semibold">Priority</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Visibility</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => {
                  const isHidden = task.isHidden === true;

                  return (
                    <tr
                      key={task._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="max-w-xs px-5 py-5">
                        <p className="break-words font-semibold text-slate-800">
                          {task.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {task.description || "No description"}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-medium text-slate-700">
                          {task.user?.name || "Unknown user"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {task.user?.email || "No email"}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            task.priority === "High"
                              ? "bg-red-50 text-red-700"
                              : task.priority === "Low"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {task.priority || "Medium"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                          {task.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            isHidden
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {isHidden ? "Hidden" : "Visible"}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleVisibilityChange(task)}
                          disabled={updatingId === task._id}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isHidden
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-amber-500 text-white hover:bg-amber-600"
                          }`}
                        >
                          {updatingId === task._id ? (
                            "Updating..."
                          ) : isHidden ? (
                            <>
                              <FiEye size={15} />
                              Unhide
                            </>
                          ) : (
                            <>
                              <FiEyeOff size={15} />
                              Hide
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminTasks;