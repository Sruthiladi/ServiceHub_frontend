import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

export default function Dashboard() {
  const [activeQueries, setActiveQueries] = useState([])
  const [resolvedQueries, setResolvedQueries] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError('')

      const [activeRes, resolvedRes] = await Promise.all([
        fetch('http://localhost:8080/api/support/active', {
          headers: getAuthHeaders(),
        }),
        fetch('http://localhost:8080/api/support/resolved', {
          headers: getAuthHeaders(),
        }),
      ])

      const activeData = await activeRes.json()
      const resolvedData = await resolvedRes.json()

      if (!activeRes.ok) {
        throw new Error(activeData.message || 'Failed to fetch active support tickets')
      }

      if (!resolvedRes.ok) {
        throw new Error(resolvedData.message || 'Failed to fetch resolved support tickets')
      }

      setActiveQueries(Array.isArray(activeData) ? activeData : [])
      setResolvedQueries(Array.isArray(resolvedData) ? resolvedData : [])
    } catch (err) {
      console.error('Failed to fetch support dashboard data', err)
      setError(err.message || 'Failed to load support dashboard')
      setActiveQueries([])
      setResolvedQueries([])
    }
  }

  const allQueries = [...activeQueries, ...resolvedQueries]

  const open = allQueries.filter((q) => q.status === 'Open').length
  const inProgress = allQueries.filter((q) => q.status === 'In Progress').length
  const resolved = allQueries.filter((q) => q.status === 'Resolved').length
  const highPriority = allQueries.filter(
    (q) => q.priority === 'High' && q.status !== 'Resolved'
  ).length

  const recentQueries = allQueries
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <h1>Support Dashboard</h1>
        <p>Overview of customer support activity</p>
      </div>

      {error && <p className="auth-message error">{error}</p>}

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-label">Open Tickets</div>
          <div className="stat-value">{open}</div>
          <div className="stat-change negative">Needs attention</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{inProgress}</div>
          <div className="stat-change">Being handled</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Resolved</div>
          <div className="stat-value">{resolved}</div>
          <div className="stat-change positive">Handled successfully</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">High Priority</div>
          <div className="stat-value">{highPriority}</div>
          <div className="stat-change negative">Urgent</div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
          Recent Queries
        </h3>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentQueries.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: 'center',
                      padding: '24px',
                      color: 'var(--gray-500)',
                    }}
                  >
                    No support queries found.
                  </td>
                </tr>
              ) : (
                recentQueries.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 500 }}>Q{q.id}</td>
                    <td>{q.userName}</td>
                    <td>{q.subject}</td>
                    <td>
                      <span
                        className={`badge ${
                          q.priority === 'High'
                            ? 'badge-danger'
                            : q.priority === 'Medium'
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {q.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          q.status === 'Open'
                            ? 'badge-primary'
                            : q.status === 'In Progress'
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td>{q.createdAt}</td>
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