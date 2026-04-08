import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  const user = storedUser ? JSON.parse(storedUser) : null

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.role?.toUpperCase()

  if (userRole !== allowedRole) {
    switch (userRole) {
      case 'USER':
        return <Navigate to="/user/home" replace />
      case 'PROFESSIONAL':
        return <Navigate to="/professional/dashboard" replace />
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />
      case 'SUPPORT':
        return <Navigate to="/support/dashboard" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return children
}