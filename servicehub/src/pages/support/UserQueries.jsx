import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default function UserQueries() {
  const [queries, setQueries] = useState([])
  const [filter, setFilter] = useState('All')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchQueries = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/support/active`, {
        headers: getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch support tickets')
      }

      setQueries(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch support tickets', err)
      setError(err.message || 'Failed to fetch support tickets')
      setQueries([])
    }
  }

  useEffect(() => {
    fetchQueries()
  }, [])

  const updateStatus = async (id, status) => {
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${BASE_URL}/api/support/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status,
          resolvedBy: 'Support Team',
        }),
      })

      const text = await response.text()
      const data = text ? JSON.parse(text) : null

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update ticket status')
      }

      setSuccess(`Ticket marked as ${status}`)
      fetchQueries()

      setTimeout(() => setSuccess(''), 2500)
    } catch (err) {
      console.error('Failed to update ticket status', err)
      setError(err.message || 'Failed to update ticket status')
    }
  }

  const filtered = filter === 'All' ? queries : queries.filter((q) => q.status === filter)

  return (
    <div>
      <div className="page-header">
        <h1>User Queries</h1>
        <p>Handle open and in-progress support tickets</p>
      </div>

      {error && <p className="auth-message error">{error}</p>}
      {success && <p className="auth-message success">{success}</p>}

      <div className="category-chips" style={{ marginBottom: '20px' }}>
        {['All', 'Open', 'In Progress'].map((f) => (
          <button
            key={f}
            className={`chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
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
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                    No queries found.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 500 }}>Q{q.id}</td>
                    <td>{q.userName}</td>
                    <td>{q.subject}</td>
                    <td>{q.category}</td>
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
                          q.status === 'Open' ? 'badge-primary' : 'badge-warning'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td>{q.createdAt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {q.status === 'Open' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => updateStatus(q.id, 'In Progress')}
                          >
                            Start
                          </button>
                        )}
                        {q.status === 'In Progress' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => updateStatus(q.id, 'Resolved')}
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
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