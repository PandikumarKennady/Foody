import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/orders/restaurant/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/orders/restaurant/today`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFD93D',
      confirmed: '#4CAF50',
      preparing: '#FF9800',
      ready: '#2196F3',
      out_for_delivery: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336',
    };
    return colors[status] || '#6B6B78';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">🍽️</div>
          <h2>Foody Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-item active">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/orders" className="nav-item">
            <span>📦</span> Orders
          </Link>
          <Link to="/admin/analytics" className="nav-item">
            <span>📈</span> Analytics
          </Link>
          <Link to="/" className="nav-item">
            <span>🏠</span> View Site
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="profile-info">
              <p className="profile-name">{user?.name}</p>
              <p className="profile-restaurant">{user?.restaurantName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name}!</p>
          </div>
          <div className="header-actions">
            <span className="current-date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon orders">📦</div>
            <div className="stat-content">
              <h3>{stats?.totalOrders || 0}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon today">🌟</div>
            <div className="stat-content">
              <h3>{stats?.todayOrders || 0}</h3>
              <p>Today's Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-content">
              <h3>{stats?.pendingOrders || 0}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-content">
              <h3>₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="quick-stats">
          <div className="quick-stat">
            <span className="quick-stat-value">₹{stats?.todayRevenue?.toLocaleString() || 0}</span>
            <span className="quick-stat-label">Today's Revenue</span>
          </div>
          <div className="quick-stat">
            <span className="quick-stat-value">{stats?.completedOrders || 0}</span>
            <span className="quick-stat-label">Completed Orders</span>
          </div>
        </div>

        {/* Recent Orders */}
        <section className="recent-orders-section">
          <div className="section-header">
            <h2>Today's Orders</h2>
            <Link to="/admin/orders" className="view-all-btn">View All →</Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <span>🍽️</span>
              <h3>No orders today</h3>
              <p>Orders will appear here when customers place them</p>
            </div>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">{order.orderId}</td>
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">{order.customerName}</span>
                          <span className="customer-phone">{order.customerPhone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="item-name">{order.foodTitle}</span>
                        <span className="item-qty">x{order.quantity}</span>
                      </td>
                      <td className="amount">₹{order.totalAmount}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="time">
                        {new Date(order.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

