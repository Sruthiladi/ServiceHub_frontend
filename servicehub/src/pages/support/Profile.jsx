import { useEffect, useState } from 'react'

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Customer Support',
    shift: 'Morning (9 AM - 5 PM)',
  })

  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))

    if (storedUser) {
      setProfile((prev) => ({
        ...prev,
        name: storedUser.name || '',
        email: storedUser.email || '',
      }))
    }
  }, [])

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleSave = () => {
    setEditing(false)
    setSaved(true)

    // Save updated profile locally (frontend-only)
    localStorage.setItem('supportProfile', JSON.stringify(profile))

    setTimeout(() => setSaved(false), 2000)
  }

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('supportProfile'))

    if (savedProfile) {
      setProfile((prev) => ({
        ...prev,
        phone: savedProfile.phone || '',
        department: savedProfile.department || 'Customer Support',
        shift: savedProfile.shift || 'Morning (9 AM - 5 PM)',
      }))
    }
  }, [])

  return (
    <div>
      <div
        className="page-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1>My Profile</h1>
          <p>View and update your support agent profile</p>
        </div>

        {!editing ? (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--success-light)',
            color: 'var(--success)',
            borderRadius: 'var(--radius)',
            marginBottom: '16px',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Profile updated successfully!
        </div>
      )}

      <div className="card" style={{ padding: '28px', maxWidth: '600px' }}>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--gray-200)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--primary)',
            }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{profile.name || 'Support User'}</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
              {profile.department}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { key: 'name', label: 'Full Name', type: 'text', editable: false },
            { key: 'email', label: 'Email', type: 'email', editable: false },
            { key: 'phone', label: 'Phone', type: 'text', editable: true },
            { key: 'department', label: 'Department', type: 'text', editable: true },
            { key: 'shift', label: 'Shift', type: 'text', editable: true },
          ].map((field) => (
            <div key={field.key} className="form-group">
              <label className="form-label">{field.label}</label>

              {editing && field.editable ? (
                <input
                  className="form-input"
                  type={field.type}
                  value={profile[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : (
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--gray-700)',
                    padding: '10px 0',
                  }}
                >
                  {profile[field.key] || '-'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}