import { NavLink } from 'react-router-dom';
import { FiHome, FiTv, FiVideo, FiGrid, FiUsers, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
  { to: '/admin/categories', icon: FiGrid, label: 'Categories' },
  { to: '/admin/channels', icon: FiTv, label: 'Live Channels' },
  { to: '/admin/videos', icon: FiVideo, label: 'Videos' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/logo.png" alt="Kidsy TV" className="sidebar-logo" />
        <h2>Kidsy TV</h2>
        <span className="sidebar-badge">Admin</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="logout-btn" onClick={logout}>
        <FiLogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
