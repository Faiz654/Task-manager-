
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiList,
  FiPlus,
  FiArrowUpRight,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api/tasks";

function DashboardHome() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real tasks from the existing backend API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your dashboard.");
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch tasks."
        );
      }

      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Calculate statistics from actual task data
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const statCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      subtitle: "Tasks in your workspace",
      icon: FiList,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Completed",
      value: completedTasks,
      subtitle: "Tasks completed",
      icon: FiCheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      subtitle: `${pendingTasks} pending tasks`,
      icon: FiClock,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700";

      case "In Progress":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getDueDate = (date) => {
    if (!date) return "No due date";

    const dueDate = new Date(date);

    if (Number.isNaN(dueDate.getTime())) {
      return "No due date";
    }

    const today = new Date();
    const tomorrow = new Date();

    today.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const comparisonDate = new Date(dueDate);
    comparisonDate.setHours(0, 0, 0, 0);

    if (comparisonDate.getTime() === today.getTime()) {
      return "Today";
    }

    if (comparisonDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }

    return dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <FiRefreshCw
          size={28}
          className="animate-spin text-indigo-600"
        />
        <p className="text-sm text-slate-500">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-indigo-100 sm:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 text-sm font-semibold text-indigo-200">
            YOUR PERSONAL WORKSPACE
          </p>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
            Welcome back!
            <br />
            Let's get things done.
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">
            Stay focused on what matters. Review your tasks,
            track your progress, and make today productive.
          </p>

          <Link
            to="/dashboard/tasks"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            <FiPlus size={18} />
            Manage Tasks
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />

        <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-violet-400/20 blur-2xl" />
      </section>

      {/* Error handling */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={fetchTasks}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            <FiRefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Your Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A real summary of your workspace.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60 sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}
                  >
                    <Icon size={23} />
                  </div>

                  <FiArrowUpRight
                    className="text-slate-300"
                    size={21}
                  />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-extrabold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {stat.subtitle}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Progress and recent tasks */}
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        {/* Progress card */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Task Progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your actual task completion
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FiCheckCircle size={22} />
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-3">
            <div>
              <p className="text-4xl font-extrabold text-slate-900">
                {progress}%
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Tasks completed
              </p>
            </div>

            <span className="mb-1 text-sm font-semibold text-indigo-600">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-indigo-50/70 p-4">
            <FiCalendar
              className="shrink-0 text-indigo-600"
              size={20}
            />

            <p className="text-sm leading-5 text-slate-600">
              Keep your tasks updated to track your real progress.
            </p>
          </div>
        </article>

        {/* Recent tasks */}
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest tasks
              </p>
            </div>

            <Link
              to="/dashboard/tasks"
              className="text-sm font-bold text-indigo-600 transition hover:text-indigo-800"
            >
              View all
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-12 text-center">
              <FiList size={32} className="text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                No tasks yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first task to see it here.
              </p>

              <Link
                to="/dashboard/tasks"
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Create a task
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        task.status === "Completed"
                          ? "bg-emerald-500"
                          : task.status === "In Progress"
                          ? "bg-amber-500"
                          : "bg-slate-300"
                      }`}
                    />

                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-semibold ${
                          task.status === "Completed"
                            ? "text-slate-400 line-through"
                            : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {task.priority || "Medium"} priority
                        {" · "}
                        {getDueDate(task.dueDate)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <p className="pb-2 text-center text-xs text-slate-400">
        Your workspace · Live database data
      </p>
    </div>
  );
}

export default DashboardHome;
