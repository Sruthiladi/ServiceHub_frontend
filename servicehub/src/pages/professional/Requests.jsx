import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default function Requests() {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const professionalId = storedUser?.id

  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('All')

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/bookings/professional/${professionalId}`,
        {
          headers: getAuthHeaders(),
        }
      )

      const data = await response.json()
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch requests', err)
    }
  }

  useEffect(() => {
    if (professionalId) fetchRequests()
  }, [professionalId])

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${BASE_URL}/api/bookings/${id}/status`, {
  method: 'PUT',
  headers: getAuthHeaders(),
  body: JSON.stringify({ status }),
})
const text = await response.text()
const data = text ? JSON.parse(text) : null

if (!response.ok) {
  throw new Error(data?.message || 'Failed to update status')
}

fetchRequests()
window.dispatchEvent(new Event('dashboardUpdated'))
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const filtered =
    filter === 'All' ? requests : requests.filter((r) => r.status === filter)

  return (
    <div>
      <div className="page-header">
        <h1>Booking Requests</h1>
        <p>Manage incoming booking requests from customers</p>
      </div>

      <div className="category-chips" style={{ marginBottom: '20px' }}>
        {['All', 'Pending', 'Accepted', 'Completed', 'Declined'].map((f) => (
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
                <th>Request ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      padding: '24px',
                      color: 'var(--gray-500)',
                    }}
                  >
                    No requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>BK{r.id}</td>
                    <td>{r.customerName}</td>
                    <td>{r.serviceName}</td>
                    <td>{r.bookingDate}</td>
                    <td>{r.bookingTime}</td>
                    <td>
                      <span
                        className={`badge ${
                          r.status === 'Pending'
                            ? 'badge-warning'
                            : r.status === 'Accepted'
                            ? 'badge-primary'
                            : r.status === 'Completed'
                            ? 'badge-success'
                            : 'badge-danger'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => updateStatus(r.id, 'Accepted')}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => updateStatus(r.id, 'Declined')}
                          >
                            Decline
                          </button>
                        </div>
                      ) : r.status === 'Accepted' ? (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => updateStatus(r.id, 'Completed')}
                        >
                          Mark Complete
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--gray-400)',
                          }}
                        >
                          No action
                        </span>
                      )}
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