
import { useCallback, useEffect, useState } from "react";
import {
  FiUsers,
  FiCheckSquare,
  FiEyeOff,
  FiCheckCircle,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

const API_URL = "/api/admin";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
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
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [usersResponse, tasksResponse] = await Promise.all([
        fetch(`${API_URL}/users`, { headers }),
        fetch(`${API_URL}/tasks`, { headers }),
      ]);

      const usersData = await usersResponse.json();
      const tasksData = await tasksResponse.json();

      if (!usersResponse.ok || !tasksResponse.ok) {
        const message = !usersResponse.ok
          ? usersData.message
          : tasksData.message;

        if (
          usersResponse.status === 401 ||
          tasksResponse.status === 401
        ) {
          throw new Error(
            "Session invalid ya expire ho gaya. Dobara login karein."
          );
        }

        if (
          usersResponse.status === 403 ||
          tasksResponse.status === 403
        ) {
          throw new Error(
            "Admin access required. Is account ka role admin hona chahiye."
          );
        }

        throw new Error(
          message || "Dashboard data fetch nahi ho saka."
        );
      }

      setUsers(Array.isArray(usersData.users) ? usersData.users : []);
      setTasks(Array.isArray(tasksData.tasks) ? tasksData.tasks : []);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(err.message || "Server se connection nahi ho saka.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const hiddenTasks = tasks.filter(
    (task) => task.isHidden === true
  ).length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "Completed" || task.completed === true
  ).length;

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: FiUsers,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: FiCheckSquare,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Hidden Tasks",
      value: hiddenTasks,
      icon: FiEyeOff,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: FiCheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            OVERVIEW
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Monitor users and tasks from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2">
            <FiAlertCircle
              className="mt-0.5 shrink-0"
              size={18}
            />
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            className="shrink-0 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Users
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest registered accounts
          </p>

          {users.length === 0 ? (
            <p className="py-8 text-sm text-slate-500">
              No users found.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                    {(user.name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user.name || "Unnamed user"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {user.totalTasks || 0} tasks
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Tasks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tasks across all user accounts
          </p>

          {tasks.length === 0 ? (
            <p className="py-8 text-sm text-slate-500">
              No tasks found.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="mt-0.5 rounded-lg bg-violet-50 p-2 text-violet-600">
                    <FiCheckSquare size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-slate-800">
                      {task.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Owner:{" "}
                      {task.user?.name ||
                        task.user?.email ||
                        "Unknown"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      task.isHidden
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {task.isHidden
                      ? "Hidden"
                      : task.status || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
