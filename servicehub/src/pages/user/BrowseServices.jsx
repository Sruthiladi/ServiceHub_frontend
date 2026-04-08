import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BrowseServices() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingsMap, setRatingsMap] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/services')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch services')
      }

      const activeServices = Array.isArray(data)
        ? data.filter((s) => s.status === 'Active')
        : []

      setServices(activeServices)

      // Fetch ratings
      const ratings = {}

      for (const service of activeServices) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/reviews/service/${service.id}`
          )
          const reviews = await res.json()

          if (!res.ok) {
            throw new Error()
          }

          if (Array.isArray(reviews) && reviews.length > 0) {
            const avg =
              reviews.reduce((sum, r) => sum + r.rating, 0) /
              reviews.length

            ratings[service.id] = {
              avg: avg.toFixed(1),
              count: reviews.length,
            }
          } else {
            ratings[service.id] = { avg: '0.0', count: 0 }
          }
        } catch {
          ratings[service.id] = { avg: '0.0', count: 0 }
        }
      }

      setRatingsMap(ratings)
    } catch (err) {
      console.error('Failed to fetch services', err)
      setError(err.message || 'Failed to fetch services')
      setServices([])
    }
  }

  const categories = ['All', ...new Set(services.map((s) => s.category))]

  const filtered = services.filter((service) => {
    const name = service.name || ''
    const category = service.category || ''
    const professional = service.professionalName || ''

    const matchCategory =
      activeCategory === 'All' || category === activeCategory

    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.toLowerCase().includes(searchTerm.toLowerCase())

    return matchCategory && matchSearch
  })

  return (
    <div>
      <div className="page-header">
        <h1>Browse Services</h1>
        <p>Find the right professional for your needs</p>
      </div>

      {error && <p className="auth-message error">{error}</p>}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by service, category or professional..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px', width: '100%' }}
        />
      </div>

      <div className="category-chips">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-500)' }}>
            No services found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="pro-grid">
          {filtered.map((service) => (
            <div key={service.id} className="card pro-card">
              <div style={{ flex: 1 }}>
                <div className="pro-info">
                  <h3>{service.name}</h3>
                  <span className="pro-category">{service.category}</span>

                  <p style={{ marginTop: '6px', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                    By {service.professionalName}
                  </p>

                  <p style={{ marginTop: '6px', fontSize: '0.875rem', color: '#f59e0b', fontWeight: 600 }}>
                    ★ {ratingsMap[service.id]?.avg || '0.0'} ({ratingsMap[service.id]?.count || 0} reviews)
                  </p>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', margin: '6px 0' }}>
                  Duration: {service.duration}
                </p>

                <div className="pro-footer">
                  <div className="pro-price">
                    ₹{service.price} <span>/ booking</span>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/user/book/${service.id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}