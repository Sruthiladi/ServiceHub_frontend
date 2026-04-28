import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default function Services() {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const professionalId = storedUser?.id

  const [services, setServices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newService, setNewService] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/services/professional/${professionalId}`,
        {
          headers: getAuthHeaders(),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load services')
      }

      setServices(data)
    } catch (err) {
      setError(err.message || 'Failed to load services')
    }
  }

  useEffect(() => {
    if (professionalId) fetchServices()
  }, [professionalId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${BASE_URL}/api/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newService,
          price: Number(newService.price),
          professionalId,
        }),
      })

      // ✅ Safe parsing
      const text = await response.text()
      const data = text ? JSON.parse(text) : null

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to add service')
      }

      setSuccess('Service added successfully!')
      setNewService({ name: '', category: '', price: '', duration: '' })
      setShowForm(false)
      fetchServices()
    } catch (err) {
      setError(err.message || 'Failed to add service')
    }
  }

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/services/${id}/toggle-status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      })

      const text = await response.text()
      const data = text ? JSON.parse(text) : null

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update service status')
      }

      fetchServices()
    } catch (err) {
      setError(err.message || 'Failed to update service status')
    }
  }

  const removeService = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const text = await response.text()
      const data = text ? JSON.parse(text) : null

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to remove service')
      }

      fetchServices()
    } catch (err) {
      setError(err.message || 'Failed to remove service')
    }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>My Services</h1>
          <p>Manage the services you offer</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {error && <p className="auth-message error">{error}</p>}
      {success && <p className="auth-message success">{success}</p>}

      {showForm && (
        <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Service Name</label>
              <input
                className="form-input"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Category</label>
              <input
                className="form-input"
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ width: '140px' }}>
              <label className="form-label">Price (₹)</label>
              <input
                className="form-input"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ width: '160px' }}>
              <label className="form-label">Duration</label>
              <input
                className="form-input"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.category}</td>
                  <td>₹{s.price}</td>
                  <td>{s.duration}</td>
                  <td>
                    <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(s.id)}>
                        {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => removeService(s.id)}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                    No services added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
