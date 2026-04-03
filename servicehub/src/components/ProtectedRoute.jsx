import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRole }) {
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allowedRole) {
    switch (user.role) {
      case 'user':
        return <Navigate to="/user/home" replace />
      case 'professional':
        return <Navigate to="/professional/dashboard" replace />
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />
      case 'support':
        return <Navigate to="/support/dashboard" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return children
}