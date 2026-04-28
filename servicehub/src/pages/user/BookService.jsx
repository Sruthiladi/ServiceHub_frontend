import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAuthHeaders } from '../../utils/authHeader'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default function BookService() {
  const { id } = useParams()
  const navigate = useNavigate()
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const userId = storedUser?.id

  const [serviceData, setServiceData] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [payment, setPayment] = useState('Card')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${BASE_URL}/api/services/${id}`)
      .then((res) => res.json())
      .then((data) => setServiceData(data))
      .catch(() => setError('Failed to load service details'))
  }, [id])

  const handleConfirm = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          serviceId: Number(id),
          userId,
          bookingDate: date,
          bookingTime: time,
          notes,
          paymentMethod: payment,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed')
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (error && !serviceData) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/user/browse')}
          style={{ marginTop: '16px' }}
        >
          Browse Services
        </button>
      </div>
    )
  }

  if (!serviceData) {
    return <p>Loading service details...</p>
  }

  if (success) {
    return (
      <div
        className="card"
        style={{
          padding: '48px',
          textAlign: 'center',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>&#10003;</div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          Booking Submitted!
        </h2>
        <p
          style={{
            color: 'var(--gray-500)',
            fontSize: '0.875rem',
            marginBottom: '24px',
          }}
        >
          Your request for {serviceData.name} with {serviceData.professionalName}{' '}
          has been submitted for {date} at {time}.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/user/bookings')}
          >
            View Bookings
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/user/browse')}
          >
            Browse More
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Book a Service</h1>
        <p>Fill in the details below to confirm your booking</p>
      </div>

      <div className="book-layout">
        <form className="card book-form" onSubmit={handleConfirm}>
          <h2>Booking Details</h2>

          {error && <p className="auth-message error">{error}</p>}

          <div className="form-grid">
            <div className="form-group form-full">
              <label className="form-label">Selected Service</label>
              <input className="form-input" value={serviceData.name} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Time</label>
              <select
                className="form-select"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Select time</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>
            </div>

            <div className="form-group form-full">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Any special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="form-group form-full">
              <label className="form-label">Payment Method</label>
              <div className="payment-methods">
                {['Card', 'UPI', 'Cash'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`payment-option ${payment === method ? 'active' : ''}`}
                    onClick={() => setPayment(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '20px' }}
          >
            Confirm Booking
          </button>
        </form>

        <div className="card book-summary">
          <div className="summary-pro">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                serviceData.professionalName
              )}&background=0D8ABC&color=fff`}
              alt={serviceData.professionalName}
            />
            <div>
              <h3>{serviceData.professionalName}</h3>
              <p>{serviceData.category}</p>
            </div>
          </div>

          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '12px',
              color: 'var(--gray-900)',
            }}
          >
            Booking Summary
          </h3>
          <div className="summary-row">
            <span>Service</span>
            <span>{serviceData.name}</span>
          </div>
          <div className="summary-row">
            <span>Date</span>
            <span>{date || '—'}</span>
          </div>
          <div className="summary-row">
            <span>Time</span>
            <span>{time || '—'}</span>
          </div>
          <div className="summary-row">
            <span>Payment</span>
            <span>{payment}</span>
          </div>
          <div className="summary-row">
            <span>Service Fee</span>
            <span>₹{serviceData.price}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee</span>
            <span>₹49</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{serviceData.price + 49}</span>
          </div>
        </div>
      </div>
    </div>
  )
}