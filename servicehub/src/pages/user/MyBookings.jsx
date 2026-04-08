import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

export default function MyBookings() {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const userId = storedUser?.id

  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewedBookings, setReviewedBookings] = useState({})
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    if (userId) {
      fetchBookings()
    }
  }, [userId])

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/user/${userId}`, {
        headers: getAuthHeaders(),
      })

      const data = await res.json()
      const bookingList = Array.isArray(data) ? data : []
      setBookings(bookingList)

      const reviewStatus = {}
      for (const booking of bookingList) {
        try {
          const reviewRes = await fetch(
            `http://localhost:8080/api/reviews/booking/${booking.id}`
          )
          const reviewData = await reviewRes.json()
          reviewStatus[booking.id] = reviewData && reviewData.id ? true : false
        } catch {
          reviewStatus[booking.id] = false
        }
      }
      setReviewedBookings(reviewStatus)
    } catch (err) {
      console.error('Failed to fetch bookings', err)
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      Accepted: 'badge-primary',
      Pending: 'badge-warning',
      Completed: 'badge-success',
      Declined: 'badge-danger',
    }
    return map[status] || 'badge-primary'
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setMessage('')
    setMessageType('success')

    try {
      const response = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          serviceId: selectedBooking.serviceId,
          userId,
          professionalId: selectedBooking.professionalId,
          rating,
          comment,
        }),
      })

      const contentType = response.headers.get('content-type')
      let data

      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        throw new Error(
          typeof data === 'string'
            ? data
            : data?.message || 'Failed to submit review'
        )
      }

      setMessage('Review submitted successfully!')
      setMessageType('success')
      setSelectedBooking(null)
      setRating(5)
      setComment('')
      fetchBookings()
    } catch (err) {
      setMessage(err.message || 'Something went wrong')
      setMessageType('error')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View and manage your service bookings</p>
      </div>

      {message && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            background: messageType === 'success' ? '#ecfdf3' : '#fef3f2',
            color: messageType === 'success' ? '#027a48' : '#b42318',
            fontWeight: 500,
          }}
        >
          {message}
        </div>
      )}

      {selectedBooking && (
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>Leave a Review</h3>
          <form onSubmit={submitReview}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Rating</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Comment</label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-500)' }}>
            No bookings yet. Browse services to make your first booking.
          </p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="card booking-item">
              <div className="booking-info">
                <h4>{booking.serviceName}</h4>
                <p>
                  {booking.professionalName} &middot; {booking.bookingDate} at{' '}
                  {booking.bookingTime}
                </p>
              </div>
              <div
                className="booking-right"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  alignItems: 'flex-end',
                }}
              >
                <span className={`badge ${getStatusBadge(booking.status)}`}>
                  {booking.status}
                </span>
                <span className="booking-amount">₹{booking.amount}</span>

                {booking.status === 'Completed' && !reviewedBookings[booking.id] && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    Leave Review
                  </button>
                )}

                {booking.status === 'Completed' && reviewedBookings[booking.id] && (
                  <span
                    style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}
                  >
                    Reviewed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}