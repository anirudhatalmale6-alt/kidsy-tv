import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { FiTv, FiVideo, FiUsers, FiUserCheck } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalChannels: 0, totalVideos: 0, activeUsers: 0 });

  useEffect(() => {
    getDashboardStats().then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Channels', value: stats.totalChannels, icon: FiTv, color: '#FF6B6B' },
    { label: 'Total Videos', value: stats.totalVideos, icon: FiVideo, color: '#4ECDC4' },
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: '#FFE66D' },
    { label: 'Active Users', value: stats.activeUsers, icon: FiUserCheck, color: '#A8E6CF' },
  ];

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card" style={{ borderTopColor: color }}>
            <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
              <Icon size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="welcome-card">
        <h2>Welcome to Kidsy TV Admin Panel</h2>
        <p>Manage your live channels, on-demand videos, categories, and users from this dashboard.</p>
      </div>
    </div>
  );
}
