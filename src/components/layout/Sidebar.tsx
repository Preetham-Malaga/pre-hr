import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Building2,
  ChevronRight,
  Settings,
  X,
  Briefcase,
  ShieldCheck,
  CalendarOff,
  CalendarCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { BriefcaseBusiness } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
  to: "/jobs",
  icon: BriefcaseBusiness,
  label: "Recruitment",
},
  {
    to: "/employees",
    icon: Users,
    label: "Employees",
  },
  {
    to: "/attendance",
    icon: CalendarCheck,
    label: "Attendance",
  },
  {
    to: "/departments",
    icon: Building2,
    label: "Departments",
  },
  {
    to: "/designations",
    icon: Briefcase,
    label: "Designations",
  },
  {
    to: "/roles-permissions",
    icon: ShieldCheck,
    label: "Roles & Permissions",
  },
  {
    to: "/leave",
    icon: CalendarOff,
    label: "Leave Management",
  },
  {
    to: "/Holidays",
    icon: BriefcaseBusiness,
    label: "Holidays",
  },
  {
    to: "/settings",
    icon: Settings,
    label: "Settings",
  },

];

export function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40
        w-64 flex flex-col
        dark:bg-slate-800/95 bg-white
        dark:border-slate-700/50 border-slate-200
        border-r backdrop-blur-xl
        transition-transform duration-300 ease-in-out
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b dark:border-slate-700/50 border-slate-200">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor:
                "var(--color-primary)",
            }}
          >
            <Building2
              size={16}
              className="text-white"
            />
          </div>

          <div>
            <p className="font-display text-sm font-bold dark:text-slate-100 text-slate-900">
              CorpHRMS
            </p>

            <p className="text-xs dark:text-slate-500 text-slate-500">
              Admin Portal
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg dark:hover:bg-slate-700 hover:bg-slate-100"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider dark:text-slate-500 text-slate-400">
          Menu
        </p>

        <div className="space-y-1">
          {NAV.map(
            ({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-3 py-2.5 rounded-lg
                  text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "dark:text-blue-300 text-blue-700"
                      : "dark:text-slate-400 text-slate-600 dark:hover:text-slate-100 hover:text-slate-900 dark:hover:bg-slate-700/50 hover:bg-slate-100"
                  }
                `
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                        color:
                          "var(--color-primary)",
                      }
                    : {}
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} />

                    <span className="flex-1">
                      {label}
                    </span>

                    {isActive && (
                      <ChevronRight
                        size={14}
                        style={{
                          color:
                            "var(--color-primary)",
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            )
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t dark:border-slate-700/50 border-slate-200">
        {user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg">
            <Avatar
              name={user.name}
              size="sm"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium dark:text-slate-200 text-slate-800 truncate">
                {user.name}
              </p>

              <p className="text-xs dark:text-slate-500 text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm dark:text-slate-400 text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}