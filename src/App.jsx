import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// Public Landing Page & Auth
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";

// User Portal Pages (12 pages)
import UserDashboard from "./pages/user/Dashboard";
import UserInvestment from "./pages/user/Investment";
import UserInvestments from "./pages/user/Investments";
import UserNotifications from "./pages/user/Notifications";
import UserProfile from "./pages/user/Profile";
import UserReferrals from "./pages/user/Referrals";
import UserROIHistory from "./pages/user/ROIHistory";
import UserSecurity from "./pages/user/Security";
import UserSupport from "./pages/user/Support";
import UserTransactions from "./pages/user/Transactions";
import UserWallet from "./pages/user/Wallet";
import UserWithdraw from "./pages/user/Withdraw";

// Admin Portal Pages (15 pages)
import AdminAuditLogs from "./pages/admin/AuditLogs";
import AdminBlockchain from "./pages/admin/Blockchain";
import AdminCMS from "./pages/admin/CMS";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInvestments from "./pages/admin/Investments";
import AdminNotifications from "./pages/admin/Notifications";
import AdminPackages from "./pages/admin/Packages";
import AdminReferrals from "./pages/admin/Referrals";
import AdminReports from "./pages/admin/Reports";
import AdminROIManagement from "./pages/admin/ROIManagement";
import AdminSettings from "./pages/admin/Settings";
import AdminTransactions from "./pages/admin/Transactions";
import AdminUserDetails from "./pages/admin/UserDetails";
import AdminUsers from "./pages/admin/Users";
import AdminWithdrawals from "./pages/admin/Withdrawals";

export default function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <Routes>
          {/* Public Website / Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />

          {/* User Portal (12 Pages) */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/investment" element={<UserInvestment />} />
            <Route path="/investments" element={<UserInvestments />} />
            <Route path="/roi-history" element={<UserROIHistory />} />
            <Route path="/roi" element={<UserROIHistory />} />
            <Route path="/referrals" element={<UserReferrals />} />
            <Route path="/wallet" element={<UserWallet />} />
            <Route path="/withdraw" element={<UserWithdraw />} />
            <Route path="/transactions" element={<UserTransactions />} />
            <Route path="/notifications" element={<UserNotifications />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/security" element={<UserSecurity />} />
            <Route path="/support" element={<UserSupport />} />
          </Route>

          {/* Admin Portal (15 Pages) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetails />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="investments" element={<AdminInvestments />} />
            <Route path="roi" element={<AdminROIManagement />} />
            <Route path="referrals" element={<AdminReferrals />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="blockchain" element={<AdminBlockchain />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="cms" element={<AdminCMS />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WalletProvider>
    </BrowserRouter>
  );
}
