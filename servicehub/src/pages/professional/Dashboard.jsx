import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default function Dashboard() {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const professionalId = storedUser?.id

  const [dashboard, setDashboard] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    completedJobs: 0,
    totalEarnings: 0,
    recentBookings: [],
  })

  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/professional/${professionalId}/dashboard`,
        {
          headers: getAuthHeaders(),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard')
      }

      setDashboard(data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
      setError(error.message || 'Failed to fetch dashboard')
    }
  }

  useEffect(() => {
    if (professionalId) {
      fetchDashboard()
    }
  }, [professionalId])
  useEffect(() => {
  const handleUpdate = () => {
    fetchDashboard()
  }

  window.addEventListener('dashboardUpdated', handleUpdate)

  return () => {
    window.removeEventListener('dashboardUpdated', handleUpdate)
  }
}, [])

  return (
    <div>
      <div className="page-header">
        <h1>Professional Dashboard</h1>
        <p>Overview of your business performance</p>
      </div>

      {error && <p className="auth-message error">{error}</p>}

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{dashboard.totalBookings}</div>
          <div className="stat-change positive">All bookings</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{dashboard.pendingRequests}</div>
          <div className="stat-change">Needs attention</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Completed Jobs</div>
          <div className="stat-value">{dashboard.completedJobs}</div>
          <div className="stat-change positive">Completed successfully</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">₹{dashboard.totalEarnings?.toLocaleString()}</div>
          <div className="stat-change positive">From completed jobs</div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
          Recent Bookings
        </h3>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recentBookings?.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                    No bookings found.
                  </td>
                </tr>
              ) : (
                dashboard.recentBookings?.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 500 }}>BK{b.id}</td>
                    <td>{b.customerName}</td>
                    <td>{b.serviceName}</td>
                    <td>{b.bookingDate}</td>
                    <td>{b.bookingTime}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === 'Accepted'
                            ? 'badge-primary'
                            : b.status === 'Pending'
                            ? 'badge-warning'
                            : b.status === 'Completed'
                            ? 'badge-success'
                            : 'badge-danger'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{b.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}