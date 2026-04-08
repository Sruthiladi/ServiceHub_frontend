import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiHome, FiSearch, FiCalendar, FiHelpCircle, FiLogOut } from 'react-icons/fi' // Added Icons
import '../styles/user.css'

export default function UserLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
  navigate('/login')
}

  return (
    <div className="user-layout-container">
      <nav className="user-navbar">
        <div className="nav-brand">ServiceHub</div>
        
        <div className="nav-links">
          <NavLink to="/user/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiHome className="nav-icon" />
            <span>Home</span>
          </NavLink>
          <NavLink to="/user/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiSearch className="nav-icon" />
            <span>Browse</span>
          </NavLink>
          <NavLink to="/user/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiCalendar className="nav-icon" />
            <span>Bookings</span>
          </NavLink>
          <NavLink to="/user/help" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <FiHelpCircle className="nav-icon" />
            <span>Help</span>
          </NavLink>
          <button className="nav-link logout" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="user-content">
        <Outlet />
      </main>
    </div>
  )
}