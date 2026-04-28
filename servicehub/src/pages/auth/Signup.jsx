import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/auth.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const roles = [
    { value: 'USER', label: 'User' },
    { value: 'PROFESSIONAL', label: 'Professional' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'SUPPORT', label: 'Support' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      const normalizedRole = data.role?.toUpperCase()
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', normalizedRole)
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...data,
          role: normalizedRole,
        })
      )

      setSuccess('Account created successfully! Redirecting...')

      // ✅ FIXED redirect map (uppercase)
      const redirectMap = {
        USER: '/user/home',
        PROFESSIONAL: '/professional/dashboard',
        ADMIN: '/admin/dashboard',
        SUPPORT: '/support/dashboard',
      }

      setTimeout(() => {
        navigate(redirectMap[normalizedRole] || '/login')
      }, 1000)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>ServiceHub</h1>
          <p>Create a new account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Register as</label>
            <div className="role-select-group">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`role-option ${role === r.value ? 'active' : ''}`}
                  onClick={() => setRole(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="auth-message error">{error}</p>}
          {success && <p className="auth-message success">{success}</p>}

          <button type="submit" className="btn btn-primary btn-lg">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  )
}