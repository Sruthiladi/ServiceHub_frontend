import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

import UserLayout from './layouts/UserLayout'
import UserHome from './pages/user/Home'
import BrowseServices from './pages/user/BrowseServices'
import BookService from './pages/user/BookService'
import MyBookings from './pages/user/MyBookings'
import HelpSupport from './pages/user/HelpSupport'

import ProfessionalLayout from './layouts/ProfessionalLayout'
import ProDashboard from './pages/professional/Dashboard'
import ProProfile from './pages/professional/Profile'
import ProServices from './pages/professional/Services'
import ProRequests from './pages/professional/Requests'
import ProEarnings from './pages/professional/Earnings'

import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageProfessionals from './pages/admin/ManageProfessionals'
import ManageServices from './pages/admin/ManageServices'
import AdminSettings from './pages/admin/Settings'

import SupportLayout from './layouts/SupportLayout'
import SupportDashboard from './pages/support/Dashboard'
import UserQueries from './pages/support/UserQueries'
import ResolvedIssues from './pages/support/ResolvedIssues'
import SupportProfile from './pages/support/Profile'

import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="user">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<UserHome />} />
        <Route path="browse" element={<BrowseServices />} />
        <Route path="book/:id" element={<BookService />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="help" element={<HelpSupport />} />
      </Route>

      <Route
        path="/professional"
        element={
          <ProtectedRoute allowedRole="professional">
            <ProfessionalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ProDashboard />} />
        <Route path="profile" element={<ProProfile />} />
        <Route path="services" element={<ProServices />} />
        <Route path="requests" element={<ProRequests />} />
        <Route path="earnings" element={<ProEarnings />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="professionals" element={<ManageProfessionals />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route
        path="/support"
        element={
          <ProtectedRoute allowedRole="support">
            <SupportLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SupportDashboard />} />
        <Route path="queries" element={<UserQueries />} />
        <Route path="resolved" element={<ResolvedIssues />} />
        <Route path="profile" element={<SupportProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}