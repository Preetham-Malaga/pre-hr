import { useState } from "react";
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
  CalendarOff,
  CalendarCheck,
  Calendar,
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
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Employees",
    to: "/employees",
    icon: Users,
  },

  {
    label: "Attendance",
    to: "/attendance",
    icon: CalendarCheck,
  },

  {
    label: "Leave Management",
    icon: CalendarOff,
    children: [
      {
        label: "Leave Types",
        to: "/leave-types",
      },
      {
        label: "Leave Balances",
        to: "/leave-balances",
      },
      {
        label: "Leave Apply",
        to: "/leave-apply",
      },
      {
        label: "Leave Approval",
        to: "/leave-approval",
      },
      {
        label: "Leave Requests",
        to: "/leave-requests",
      },
      {
        label: "Leave Calendar",
        to: "/leave-calendar",
      },
    ],
  },

  {
    label: "Organization",
    icon: Building2,
    children: [
      {
        label: "Departments",
        to: "/departments",
      },
      {
        label: "Designations",
        to: "/designations",
      },
      {
        label: "Roles & Permissions",
        to: "/roles-permissions",
      },
    ],
  },

  {
    label: "Recruitment",
    icon: BriefcaseBusiness,
    children: [
      {
        label: "Candidates",
        to: "/candidates",
      },
      {
        label: "Interviews",
        to: "/interviews",
      },
      {
        label: "Offers",
        to: "/offers",
      },
    ],
  },

  {
    label: "Payroll",
    icon: Briefcase,
    children: [
      {
        label: "Payroll",
        to: "/payroll",
      },
      {
        label: "Payslips",
        to: "/payslips",
      },
    ],
  },

  {
    label: "Holiday Management",
    icon: Calendar,
    children: [
      {
        label: "Holidays",
        to: "/holidays",
      },
    ],
  },

  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

export function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [openMenu, setOpenMenu] =
  useState<string | null>(null);

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
         {NAV.map((item) => {
  const Icon = item.icon;

  if (item.children) {
    return (
      <div key={item.label}>
        <button
          onClick={() =>
            setOpenMenu(
              openMenu === item.label
                ? null
                : item.label
            )
          }
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Icon size={16} />

          <span className="flex-1 text-left">
            {item.label}
          </span>

          <ChevronRight
            size={14}
            className={`transition-transform ${
              openMenu === item.label
                ? "rotate-90"
                : ""
            }`}
          />
        </button>

        {openMenu === item.label && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map(
              (child) => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {child.label}
                </NavLink>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      key={item.to}
      to={item.to!}
      onClick={onClose}
      className={({ isActive }) =>
        `
        flex items-center gap-3
        px-3 py-2.5 rounded-lg
        text-sm font-medium
        ${
          isActive
            ? "text-blue-600"
            : "text-slate-600"
        }
      `
      }
    >
      <Icon size={16} />

      <span className="flex-1">
        {item.label}
      </span>
    </NavLink>
  );
})}
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