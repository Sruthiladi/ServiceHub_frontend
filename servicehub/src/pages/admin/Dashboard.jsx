import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfessionals: 0,
    totalBookings: 0,
    openTickets: 0,
  })

  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
    fetchUsers()
    fetchServices()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/dashboard', {
        headers: getAuthHeaders(),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats')
      }

      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError(error.message || 'Failed to fetch dashboard stats')
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/users', {
        headers: getAuthHeaders(),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch users')
      }

      setUsers(Array.isArray(data) ? data.slice(0, 5) : [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setError(error.message || 'Failed to fetch users')
    }
  }

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/services', {
        headers: getAuthHeaders(),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch services')
      }

      setServices(Array.isArray(data) ? data.slice(0, 5) : [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setError(error.message || 'Failed to fetch services')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform overview and key metrics</p>
      </div>

      {error && <p className="auth-message error">{error}</p>}

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-change positive">Registered users</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Professionals</div>
          <div className="stat-value">{stats.totalProfessionals}</div>
          <div className="stat-change positive">Available professionals</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{stats.totalBookings}</div>
          <div className="stat-change positive">Bookings made</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Open Tickets</div>
          <div className="stat-value">{stats.openTickets}</div>
          <div className="stat-change negative">Needs attention</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Recent Users</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '24px' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge badge-success">{u.status || 'Active'}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Recent Services</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>
                      No services found.
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.id}</td>
                      <td>{s.name}</td>
                      <td>
                        <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{s.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}