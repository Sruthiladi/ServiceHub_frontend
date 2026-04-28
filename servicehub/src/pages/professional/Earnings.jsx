import { useEffect, useState } from 'react'
import { getAuthHeaders } from '../../utils/authHeader'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default function Earnings() {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const professionalId = storedUser?.id

  const [summary, setSummary] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    pendingJobs: 0,
    pendingPayouts: 0,
  })

  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (professionalId) {
      fetchEarnings()
      fetchTransactions()
    }
  }, [professionalId])

  const fetchEarnings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/professional/${professionalId}/earnings`,
        {
                  headers: getAuthHeaders(),
                }
      )
      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error('Failed to fetch earnings:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/professional/${professionalId}/earnings/bookings`,
        {
                  headers: getAuthHeaders(),
                }
      )
      const data = await response.json()
      setTransactions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      setTransactions([])
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Earnings</h1>
        <p>Track your income and payment history</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">₹{summary.totalEarnings.toLocaleString()}</div>
          <div className="stat-change positive">Completed jobs only</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Completed Jobs</div>
          <div className="stat-value">{summary.completedJobs}</div>
          <div className="stat-change positive">Successfully delivered</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Pending Jobs</div>
          <div className="stat-value">{summary.pendingJobs}</div>
          <div className="stat-change">Awaiting completion</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Pending Payouts</div>
          <div className="stat-value">₹{summary.pendingPayouts.toLocaleString()}</div>
          <div className="stat-change">Expected earnings</div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
          Transaction History
        </h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>BK{t.id}</td>
                    <td>{t.serviceName}</td>
                    <td>{t.customerName}</td>
                    <td>{t.bookingDate}</td>
                    <td style={{ fontWeight: 600 }}>₹{t.amount}</td>
                    <td>
                      <span className={`badge ${
                        t.status === 'Completed'
                          ? 'badge-success'
                          : t.status === 'Accepted'
                          ? 'badge-primary'
                          : t.status === 'Pending'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}>
                        {t.status}
                      </span>
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