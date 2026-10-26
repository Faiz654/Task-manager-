
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  FiGrid,
  FiUsers,
  FiCheckSquare,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
} from "react-icons/fi";

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiGrid,
      end: true,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: FiUsers,
    },
    {
      name: "Tasks",
      path: "/dashboard/tasks",
      icon: FiCheckSquare,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
        <div className="flex items-center gap-2">
          <FiShield className="text-2xl text-indigo-600" />
          <span className="text-lg font-bold">Task Manager Admin</span>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <FiShield size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Task Manager
              </h1>
              <p className="text-xs font-medium text-indigo-600">
                ADMIN PANEL
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-7">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                    }`
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Admin Info + Logout */}
          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-800">
                Administrator
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Manage users and tasks
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <FiLogOut size={19} />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {menuOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
            <p className="text-sm text-slate-500">
              Task Manager / Administration
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Admin Workspace
            </h2>
          </div>

          <div className="p-4 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
