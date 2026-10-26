
import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiCircle,
  FiX,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api/tasks";

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const apiRequest = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
      throw new Error("Session expired. Please log in again.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  };

  const normalizeTask = (task) => ({
    ...task,
    id: task._id,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    status:
      task.status ||
      (task.completed ? "Completed" : "Pending"),
    priority: task.priority || "Medium",
  });

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(API_URL);
      setTasks((data.tasks || []).map(normalizeTask));
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      const isEditing = editingId !== null;
      const url = isEditing
        ? `${API_URL}/${editingId}`
        : API_URL;

      const data = await apiRequest(url, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          priority: form.priority,
          status: form.status,
          dueDate: form.dueDate || null,
        }),
      });

      if (isEditing) {
        setTasks((current) =>
          current.map((task) =>
            task.id === editingId
              ? normalizeTask(data.task)
              : task
          )
        );
      } else {
        setTasks((current) => [
          normalizeTask(data.task),
          ...current,
        ]);
      }

      closeForm();
    } catch (err) {
      setError(err.message || "Failed to save task.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      dueDate: task.dueDate || "",
    });

    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await apiRequest(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setTasks((current) =>
        current.filter((task) => task.id !== id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete task.");
    }
  };

  const toggleComplete = async (task) => {
    const newStatus =
      task.status === "Completed" ? "Pending" : "Completed";

    setError("");

    try {
      const data = await apiRequest(`${API_URL}/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id
            ? normalizeTask(data.task)
            : item
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update task status.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || task.status === filter;

    return matchesSearch && matchesFilter;
  });

  const priorityStyles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-blue-50 text-blue-600",
  };

  const statusStyles = {
    Completed: "bg-emerald-50 text-emerald-600",
    "In Progress": "bg-violet-50 text-violet-600",
    Pending: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-600">
            Workspace / Tasks
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            My Tasks
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Organize your work and keep track of your progress.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
        >
          <FiPlus size={18} />
          Add New Task
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Tasks",
            value: tasks.length,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "Completed",
            value: tasks.filter(
              (task) => task.status === "Completed"
            ).length,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Pending",
            value: tasks.filter(
              (task) => task.status !== "Completed"
            ).length,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}
            >
              <FiCheckCircle className={item.color} size={20} />
            </div>
            <p className="text-sm text-slate-500">{item.label}</p>
            <h2 className={`mt-1 text-2xl font-bold ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
        >
          <option value="All">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">All Tasks</h2>
          <p className="mt-1 text-xs text-slate-500">
            {filteredTasks.length} task(s) found
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-16 text-center text-sm text-slate-500">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <FiSearch
              className="mx-auto text-slate-300"
              size={32}
            />
            <h3 className="mt-3 font-semibold text-slate-800">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or add a new task.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 gap-3">
                  <button
                    onClick={() => toggleComplete(task)}
                    title="Toggle task completion"
                    className={`mt-1 shrink-0 ${
                      task.status === "Completed"
                        ? "text-emerald-500"
                        : "text-slate-300 hover:text-violet-600"
                    }`}
                  >
                    {task.status === "Completed" ? (
                      <FiCheckCircle size={22} />
                    ) : (
                      <FiCircle size={22} />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h3
                      className={`break-words font-semibold ${
                        task.status === "Completed"
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="mt-1 break-words text-sm text-slate-500">
                      {task.description || "No description provided."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          priorityStyles[task.priority] ||
                          priorityStyles.Medium
                        }`}
                      >
                        {task.priority} Priority
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[task.status] ||
                          statusStyles.Pending
                        }`}
                      >
                        {task.status}
                      </span>

                      {task.dueDate && (
                        <span className="text-xs text-slate-400">
                          Due: {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 pl-8 sm:pl-0">
                  <button
                    onClick={() => handleEdit(task)}
                    title="Edit task"
                    className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    title="Delete task"
                    className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId !== null ? "Edit Task" : "Create New Task"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add the details for your task below.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close form"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Complete React project"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Write a short description..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
