import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiCheckSquare,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
} from "react-icons/fi";
import { useState } from "react";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Overview",
      path: "/user-dashboard",
      icon: FiGrid,
      end: true,
    },
    {
      name: "My Tasks",
      path: "/user-dashboard/tasks",
      icon: FiCheckSquare,
    },
    {
      name: "My Profile",
      path: "/user-dashboard/profile",
      icon: FiUser,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <NavLink
            to="/user-dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-black text-white shadow-lg shadow-indigo-200">
              T
            </span>

            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Task<span className="text-indigo-600">Manager</span>
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <FiX size={21} />
          </button>
        </div>

        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
            <p className="font-bold text-slate-800">Stay productive!</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Organize your tasks and make progress every day.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut size={19} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open menu"
            >
              <FiMenu size={21} />
            </button>

            <div>
              <p className="text-sm font-bold text-slate-900">
                My Workspace
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Plan your day. Make it count.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-3 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              <FiBell size={19} />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                U
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">
                  My Account
                </p>
                <p className="text-xs text-slate-500">
                  Workspace member
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
