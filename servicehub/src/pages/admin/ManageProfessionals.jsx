import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default function ManageProfessionals() {
  const [pros, setPros] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/professionals`, {
        headers: getAuthHeaders(),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch professionals')
      }

      setPros(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching professionals:', error)
      setError(error.message || 'Failed to fetch professionals')
      setPros([])
    }
  }

  const filtered = pros.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <h1>Manage Professionals</h1>
        <p>Review and manage service professionals</p>
      </div>

      {error && <p className="auth-message error">{error}</p>}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '360px', width: '100%' }}
        />
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Professional</th>
                <th>Email</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                    No professionals found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.category}</td>
                    <td>
                      <span className="badge badge-success">{p.status || 'Active'}</span>
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