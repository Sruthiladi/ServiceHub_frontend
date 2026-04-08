import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

export default function ResolvedIssues() {
  const [resolvedIssues, setResolvedIssues] = useState([])
  const [error, setError] = useState('')

  const fetchResolvedIssues = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/support/resolved', {
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch resolved issues')
      }

      setResolvedIssues(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch resolved issues', err)
      setError(err.message || 'Failed to fetch resolved issues')
      setResolvedIssues([])
    }
  }

  useEffect(() => {
    fetchResolvedIssues()
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1>Resolved Issues</h1>
        <p>Archive of resolved support tickets</p>
      </div>

      {error && <p className="auth-message error">{error}</p>}

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="card stat-card">
          <div className="stat-label">Total Resolved</div>
          <div className="stat-value">{resolvedIssues.length}</div>
          <div className="stat-change positive">All time</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Avg. Resolution Time</div>
          <div className="stat-value">1.2 days</div>
          <div className="stat-change positive">Stable</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Support Efficiency</div>
          <div className="stat-value">92%</div>
          <div className="stat-change positive">Good</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Reported</th>
                <th>Resolved</th>
                <th>Resolved By</th>
              </tr>
            </thead>
            <tbody>
              {resolvedIssues.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                    No resolved issues yet.
                  </td>
                </tr>
              ) : (
                resolvedIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td style={{ fontWeight: 500 }}>Q{issue.id}</td>
                    <td>{issue.userName}</td>
                    <td>{issue.subject}</td>
                    <td>{issue.category}</td>
                    <td>
                      <span
                        className={`badge ${
                          issue.priority === 'High'
                            ? 'badge-danger'
                            : issue.priority === 'Medium'
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {issue.priority}
                      </span>
                    </td>
                    <td>{issue.createdAt}</td>
                    <td>{issue.resolvedAt}</td>
                    <td>{issue.resolvedBy}</td>
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