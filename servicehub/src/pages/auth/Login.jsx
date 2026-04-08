import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/auth.css'

export default function Login() {
  const navigate = useNavigate()
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
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setSuccess('Login successful! Redirecting...')

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
          <p>Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Login as</label>
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
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          {"Don't have an account? "}
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  )
}