import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '../auth/ProtectedRoute'
import AdminLayout from '../layouts/AdminLayout'

import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import BusinessesPage from '../pages/BusinessesPage'
import BusinessDetailPage from '../pages/BusinessDetailPage'

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

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}