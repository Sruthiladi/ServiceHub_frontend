import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiGrid,
  FiUsers,
  FiTool,
  FiPackage,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'
import '../styles/sidebar.css'

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
  { to: '/admin/professionals', label: 'Manage Professionals', icon: <FiTool /> },
  { to: '/admin/services', label: 'Manage Services', icon: <FiPackage /> },
  { to: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  navigate('/login')
}

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="sidebar-layout">
      {/* 1. Hamburger button (Only visible when sidebar is closed) */}
      {!isMobileMenuOpen && (
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
          <FiMenu />
        </button>
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-flex">
            <h2>ServiceHub</h2>
            {/* 2. Close button inside sidebar for consistency */}
            <button className="close-sidebar" onClick={closeMenu}>
              <FiX />
            </button>
          </div>
          <span>Administrator</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <button className="sidebar-link logout" onClick={handleLogout}>
            <span className="sidebar-icon">
              <FiLogOut />
            </span>
            Logout
          </button>
        </nav>
      </aside>

      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={closeMenu}></div>}

      <main className="sidebar-main">
        <Outlet />
      </main>
    </div>
  )
}