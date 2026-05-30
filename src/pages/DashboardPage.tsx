import { useMemo } from "react";
import {
  Users,
  UserCheck,
  Building2,
  TrendingUp,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { StatusBadge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { useUsers } from "../context/UsersContext";
import { empFullName } from "../types";

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  iconBg: string;
  loading?: boolean;
}) {
  return (
    <div className="card flex flex-col gap-4">
      <div
        className={
          "w-10 h-10 rounded-xl " +
          iconBg +
          " flex items-center justify-center"
        }
      >
        <Icon size={18} className="text-white" />
      </div>

      {loading ? (
        <div className="h-9 dark:bg-slate-700/50 bg-slate-100 rounded-lg animate-pulse" />
      ) : (
        <div>
          <p className="font-display text-3xl font-bold dark:text-slate-100 text-slate-900">
            {value}
          </p>

          <p className="text-xs dark:text-slate-500 text-slate-500 mt-1">
            {label}
          </p>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { users, loading } = useUsers();

  const stats = useMemo(
    () => ({
      total: users.length,
      departments: new Set(users.map((u: any) => u.department)).size,
      managers: users.filter((u: any) =>
        (u.designation || "")
          .toLowerCase()
          .includes("manager")
      ).length,
      active: users.filter(
        (u: any) => u.status === "Active"
      ).length,
    }),
    [users]
  );

  const recentEmployees = users.slice(0, 6);

  const topDepts = useMemo(() => {
    const map = users.reduce<Record<string, number>>(
      (acc, u: any) => {
        acc[u.department] =
          (acc[u.department] ?? 0) + 1;

        return acc;
      },
      {}
    );

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [users]);

  const maxDept =
    topDepts.length > 0
      ? Number(topDepts[0][1])
      : 1;

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={new Date().toLocaleDateString(
          "en-IN",
          {
            dateStyle: "long",
          }
        )}
      />

      <div className="p-4 sm:p-6 space-y-6 page-enter">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Employees"
            value={stats.total}
            icon={Users}
            iconBg="bg-blue-600"
            loading={loading}
          />

          <StatCard
            label="Total Departments"
            value={stats.departments}
            icon={Building2}
            iconBg="bg-purple-600"
            loading={loading}
          />

          <StatCard
            label="Total Managers"
            value={stats.managers}
            icon={UserCheck}
            iconBg="bg-amber-600"
            loading={loading}
          />

          <StatCard
            label="Active Employees"
            value={stats.active}
            icon={TrendingUp}
            iconBg="bg-emerald-600"
            loading={loading}
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2
              size={22}
              className="animate-spin dark:text-slate-500 text-slate-400"
            />
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="card flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-16 h-16 rounded-full dark:bg-slate-700/60 bg-slate-100 flex items-center justify-center">
              <Users
                size={28}
                className="dark:text-slate-500 text-slate-400"
              />
            </div>

            <div>
              <p className="font-display font-semibold dark:text-slate-200 text-slate-700 text-lg">
                No employee data available
              </p>

              <p className="text-sm dark:text-slate-500 text-slate-500 mt-1">
                Add your first employee to see dashboard metrics.
              </p>
            </div>

            <Link
              to="/employees"
              className="btn-primary"
            >
              <UserPlus size={15} />
              Add First Employee
            </Link>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-sm font-bold dark:text-slate-200 text-slate-800">
                  Recent Employees
                </h3>

                <Link
                  to="/employees"
                  className="text-xs transition-colors"
                  style={{
                    color: "var(--color-primary)",
                  }}
                >
                  View all
                </Link>
              </div>

              <div className="space-y-1">
                {recentEmployees.map((emp: any) => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg table-row-hover"
                  >
                    <Avatar
                      name={empFullName(emp)}
                      size="sm"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium dark:text-slate-200 text-slate-800 truncate">
                        {empFullName(emp)}
                      </p>

                      <p className="text-xs dark:text-slate-500 text-slate-500 truncate">
                        {emp.department}
                      </p>
                    </div>

                    <div className="hidden sm:block">
                      <StatusBadge
                        status={emp.status}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-display text-sm font-bold dark:text-slate-200 text-slate-800 mb-5">
                By Department
              </h3>

              <div className="space-y-3.5">
                {topDepts.map(([dept, count]) => (
                  <div key={dept}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs dark:text-slate-400 text-slate-600 truncate pr-2">
                        {dept}
                      </p>

                      <p className="text-xs font-semibold dark:text-slate-300 text-slate-700 font-mono shrink-0">
                        {count}
                      </p>
                    </div>

                    <div className="h-1.5 dark:bg-slate-700/60 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(Number(count) / maxDept) * 100}%`,
                          backgroundColor:
                            "var(--color-primary)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}