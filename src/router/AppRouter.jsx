import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '../auth/ProtectedRoute'
import AdminLayout from '../layouts/AdminLayout'

import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import BusinessesPage from '../pages/BusinessesPage'
import BusinessDetailPage from '../pages/BusinessDetailPage'
import PlatformUsersPage from '../pages/PlatformUsersPage'
import PlansPage from '../pages/PlansPage'
import SubscriptionsPage from '../pages/SubscriptionsPage'
import ActivityLogsPage from '../pages/ActivityLogsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/businesses"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <BusinessesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/businesses/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <BusinessDetailPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/platform-users"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PlatformUsersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <PlansPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <SubscriptionsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity-logs"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ActivityLogsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}