import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { UsersProvider } from "./context/UsersContext";
import { ToastProvider } from "./context/ToastContext";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import SettingsPage from "./pages/SettingsPage";

import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import EmployeeProfile from "./pages/EmployeeProfile";
import RolesPermissions from "./pages/RolesPermissions";
import LeaveManagement from "./pages/LeaveManagement";
import Holidays        from "./pages/Holidays";
import Jobs             from "./pages/Jobs";
import CandidatesPage   from "./pages/CandidatesPage";
import InterviewsPage    from "./pages/InterviewsPage";
import OffersPage from "./pages/OffersPage";
import LeaveTypes from "./pages/LeaveTypes";  
import LeaveRequests from "./pages/LeaveRequests";
import LeaveBalances from "./pages/LeaveBalances";
import LeaveApply from "./pages/LeaveApply";
import LeaveApproval from "./pages/LeaveApproval";
import LeaveCalendar from "./pages/LeaveCalendar";
import Payroll from "./pages/Payroll";
import Payslips from "./pages/Payslips";
import Attendance from "./pages/Attendance";



export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <UsersProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/reset-password"
                  element={<ResetPasswordPage />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route
                      path="/dashboard"
                      element={<DashboardPage />}
                    />

                    <Route
                      path="/employees"
                      element={<EmployeesPage />}
                    />
            
                    <Route
                      path="/attendance"
                      element={<Attendance />}
                    />

                    <Route
                      path="/departments"
                      element={<Departments />}
                    />

                    <Route
                      path="/designations"
                      element={<Designations />}
                    />

                    <Route
                      path="/employee-profile"
                      element={<EmployeeProfile />}
                    />

                    <Route
                      path="/roles-permissions"
                      element={<RolesPermissions />}
                    />

                    <Route
                      path="/leave"
                      element={<LeaveManagement />}
                    />
                    <Route
  path="/leave-balances"
  element={<LeaveBalances />}
/>
                    <Route
  path="/leave-types"
  element={<LeaveTypes />}
/>
<Route
  path="/leave-apply"
  element={<LeaveApply />}
/>
<Route
  path="/leave-approval"
  element={<LeaveApproval />}
/>
<Route
  path="/leave-calendar"
  element={<LeaveCalendar />}
/>
                    <Route
  path="/candidates"
  element={<CandidatesPage />}
/>
<Route
  path="/interviews"
  element={<InterviewsPage />}
/>
<Route
  path="/offers"
  element={<OffersPage />}
/>
<Route
  path="/payroll"
  element={<Payroll />}
/>
<Route
  path="/leave-requests"
  element={<LeaveRequests />}
/>
<Route
  path="/payslips"
  element={<Payslips />}
/>
                    <Route
                      path="/settings"
                      element={<SettingsPage />}
                    />
                    <Route
  path="/jobs"
  element={<Jobs />}
/>

                    <Route
                      path="/holidays"
                      element={<Holidays />}
                    />

                    <Route
                      path="/"
                      element={
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      }
                    />

                    <Route
                      path="*"
                      element={
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      }
                    />
                  </Route>
                </Route>
              </Routes>
            </UsersProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}