import { useEffect, useState } from 'react'

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Technology',
    experience: '0 years',
    location: '',
    bio: '',
  })

  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load logged-in user details
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

  // Load extra professional details from localStorage
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('professionalProfile'))

    if (savedProfile) {
      setProfile((prev) => ({
        ...prev,
        phone: savedProfile.phone || '',
        category: savedProfile.category || 'Technology',
        experience: savedProfile.experience || '0 years',
        location: savedProfile.location || '',
        bio: savedProfile.bio || '',
      }))
    }
  }, [])

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleSave = () => {
    setEditing(false)

    // Save only editable extra fields
    localStorage.setItem(
      'professionalProfile',
      JSON.stringify({
        phone: profile.phone,
        category: profile.category,
        experience: profile.experience,
        location: profile.location,
        bio: profile.bio,
      })
    )

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1>My Profile</h1>
          <p>Manage your professional profile</p>
        </div>

        {!editing ? (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setEditing(false)}
            >
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

      <div className="card" style={{ padding: '28px' }}>
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'flex-start',
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--gray-200)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--primary)',
            }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'P'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {profile.name || 'Professional User'}
            </h2>

            <p
              style={{
                color: 'var(--primary)',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              {profile.category}
            </p>

            <p
              style={{
                color: 'var(--gray-500)',
                fontSize: '0.8125rem',
              }}
            >
              {profile.experience} experience
              {profile.location ? ` · ${profile.location}` : ''}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <p className="form-value">{profile.name || '-'}</p>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <p className="form-value">{profile.email || '-'}</p>
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            {editing ? (
              <input
                className="form-input"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            ) : (
              <p className="form-value">{profile.phone || '-'}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            {editing ? (
              <input
                className="form-input"
                value={profile.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
            ) : (
              <p className="form-value">{profile.category || '-'}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Experience</label>
            {editing ? (
              <input
                className="form-input"
                value={profile.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
              />
            ) : (
              <p className="form-value">{profile.experience || '-'}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            {editing ? (
              <input
                className="form-input"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            ) : (
              <p className="form-value">{profile.location || '-'}</p>
            )}
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Bio</label>
            {editing ? (
              <textarea
                className="form-textarea"
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            ) : (
              <p className="form-value">{profile.bio || '-'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}