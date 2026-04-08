import { useEffect, useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'ServiceHub',
    contactEmail: '',
    platformFee: '49',
    autoApprove: false,
    emailNotifications: true,
    maintenanceMode: false,
  })

  const [saved, setSaved] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem('adminSettings'))
    const storedUser = JSON.parse(localStorage.getItem('user'))

    if (storedSettings) {
      setSettings(storedSettings)
    } else if (storedUser) {
      // fallback: use admin email from login
      setSettings((prev) => ({
        ...prev,
        contactEmail: storedUser.email || '',
      }))
    }
  }, [])

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('adminSettings', JSON.stringify(settings))

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure platform-wide settings</p>
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
          Settings saved successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* General Settings */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>
            General Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input
                className="form-input"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                className="form-input"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{'Platform Fee (₹)'}</label>
              <input
                className="form-input"
                type="number"
                value={settings.platformFee}
                onChange={(e) => handleChange('platformFee', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>
            Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                key: 'autoApprove',
                label: 'Auto-approve professionals',
                description: 'Skip manual review for new professional signups',
              },
              {
                key: 'emailNotifications',
                label: 'Email notifications',
                description: 'Send email alerts for new bookings and queries',
              },
              {
                key: 'maintenanceMode',
                label: 'Maintenance mode',
                description: 'Show maintenance page to all visitors',
              },
            ].map((pref) => (
              <div
                key={pref.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--gray-100)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {pref.label}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                    {pref.description}
                  </div>
                </div>

                <button
                  className={`btn btn-sm ${
                    settings[pref.key] ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() => handleChange(pref.key, !settings[pref.key])}
                  style={{ minWidth: '60px' }}
                >
                  {settings[pref.key] ? 'On' : 'Off'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  )
}