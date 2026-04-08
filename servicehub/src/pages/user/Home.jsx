import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
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

      // Extract categories dynamically
      const uniqueCategories = [
        ...new Set(activeServices.map((s) => s.category)),
      ]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error loading services')
      setServices([])
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/user/browse')
  }

  // Take top 3 services as featured
  const featured = services.slice(0, 3)

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <h1>Find Trusted Professionals Near You</h1>
        <p>
          Book verified service professionals for plumbing, electrical,
          cleaning, and more — all in one place.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn">Search</button>
        </form>
      </section>

      {error && <p className="auth-message error">{error}</p>}

      {/* CATEGORIES */}
      <div className="page-header">
        <h1>Popular Categories</h1>
        <p>Browse by service type</p>
      </div>

      <div className="category-chips" style={{ marginBottom: '32px' }}>
        {categories.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>No categories available.</p>
        ) : (
          categories.map((cat) => (
            <button
              key={cat}
              className="chip"
              onClick={() => navigate('/user/browse')}
            >
              {cat}
            </button>
          ))
        )}
      </div>

      {/* FEATURED SERVICES */}
      <div className="page-header">
        <h1>Featured Services</h1>
        <p>Top services available right now</p>
      </div>

      <div className="pro-grid">
        {featured.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>No services available.</p>
        ) : (
          featured.map((service) => (
            <div key={service.id} className="card pro-card">
              <div style={{ flex: 1 }}>
                <div className="pro-info">
                  <h3>{service.name}</h3>
                  <span className="pro-category">{service.category}</span>

                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    By {service.professionalName}
                  </p>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
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
          ))
        )}
      </div>
    </div>
  )
}