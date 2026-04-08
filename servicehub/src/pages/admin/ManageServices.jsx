import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

export default function ManageServices() {
  const [services, setServices] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/services', {
        headers: getAuthHeaders(),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch services')
      }

      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setError(error.message || 'Failed to fetch services')
      setServices([])
    }
  }

  const toggleStatus = async (id) => {
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`http://localhost:8080/api/admin/services/${id}/toggle-status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      })

      const text = await response.text()
      const data = text ? JSON.parse(text) : null

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update service status')
      }

      setSuccess('Service status updated successfully')
      fetchServices()

      setTimeout(() => setSuccess(''), 2500)
    } catch (error) {
      console.error('Error toggling service status:', error)
      setError(error.message || 'Failed to update service status')
    }
  }

  const removeService = async (id) => {
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`http://localhost:8080/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const text = await response.text()
      const data = text ? JSON.parse(text) : null

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to remove service')
      }

      setSuccess('Service removed successfully')
      fetchServices()

      setTimeout(() => setSuccess(''), 2500)
    } catch (error) {
      console.error('Error removing service:', error)
      setError(error.message || 'Failed to remove service')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Manage Services</h1>
        <p>View and manage all service listings</p>
      </div>

      {error && <p className="auth-message error">{error}</p>}
      {success && <p className="auth-message success">{success}</p>}

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Professional</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.category}</td>
                    <td>{s.professionalName}</td>
                    <td>₹{s.price}</td>
                    <td>{s.duration}</td>
                    <td>
                      <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(s.id)}>
                          {s.status === 'Active' ? 'Disable' : 'Enable'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => removeService(s.id)}>
                          Remove
                        </button>
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