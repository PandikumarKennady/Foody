import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const AdminAnalytics = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/orders/restaurant/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/orders/restaurant/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics from orders
  const getStatusDistribution = () => {
    const distribution = {};
    orders.forEach(order => {
      distribution[order.status] = (distribution[order.status] || 0) + 1;
    });
    return distribution;
  };

  const getRevenueByDay = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });
      
      const revenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const count = dayOrders.length;
      
      last7Days.push({ date: dateStr, revenue, count });
    }
    return last7Days;
  };

  const getPopularItems = () => {
    const items = {};
    orders.forEach(order => {
      items[order.foodTitle] = (items[order.foodTitle] || 0) + order.quantity;
    });
    return Object.entries(items)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const statusDistribution = getStatusDistribution();
  const revenueByDay = getRevenueByDay();
  const popularItems = getPopularItems();
  const avgOrderValue = orders.length > 0 
    ? Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length) 
    : 0;

  const statusColors = {
    pending: '#FFD93D',
    confirmed: '#4CAF50',
    preparing: '#FF9800',
    ready: '#2196F3',
    out_for_delivery: '#9C27B0',
    delivered: '#4CAF50',
    cancelled: '#F44336',
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
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
          <Link to="/admin/dashboard" className="nav-item">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/orders" className="nav-item">
            <span>📦</span> Orders
          </Link>
          <Link to="/admin/analytics" className="nav-item active">
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Analytics</h1>
            <p>Insights and performance metrics</p>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="analytics-metrics">
          <div className="metric-card large">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h2>₹{stats?.totalRevenue?.toLocaleString() || 0}</h2>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-content">
              <h3>₹{avgOrderValue}</h3>
              <p>Avg Order Value</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-content">
              <h3>{stats?.completedOrders || 0}</h3>
              <p>Completed Orders</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-content">
              <h3>{Math.round((stats?.completedOrders / stats?.totalOrders) * 100) || 0}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Revenue Chart */}
          <div className="analytics-card">
            <h3>📈 Last 7 Days Revenue</h3>
            <div className="chart-container">
              <div className="bar-chart">
                {revenueByDay.map((day, index) => (
                  <div key={index} className="bar-group">
                    <div 
                      className="bar"
                      style={{ 
                        height: `${Math.max((day.revenue / Math.max(...revenueByDay.map(d => d.revenue || 1))) * 150, 10)}px`,
                      }}
                    >
                      <span className="bar-value">₹{day.revenue}</span>
                    </div>
                    <span className="bar-label">{day.date.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="analytics-card">
            <h3>📊 Order Status Distribution</h3>
            <div className="status-distribution">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="status-item">
                  <div className="status-info">
                    <span 
                      className="status-dot" 
                      style={{ backgroundColor: statusColors[status] }}
                    ></span>
                    <span className="status-name">{status.replace('_', ' ')}</span>
                  </div>
                  <div className="status-bar-container">
                    <div 
                      className="status-bar"
                      style={{ 
                        width: `${(count / orders.length) * 100}%`,
                        backgroundColor: statusColors[status],
                      }}
                    ></div>
                  </div>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Items */}
          <div className="analytics-card">
            <h3>🔥 Popular Items</h3>
            <div className="popular-items">
              {popularItems.length === 0 ? (
                <p className="no-data">No orders yet</p>
              ) : (
                popularItems.map(([item, count], index) => (
                  <div key={item} className="popular-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="item-name">{item}</span>
                    <span className="item-count">{count} orders</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="analytics-card">
            <h3>⚡ Quick Stats</h3>
            <div className="quick-stats-grid">
              <div className="quick-stat-item">
                <span className="stat-emoji">📦</span>
                <span className="stat-value">{stats?.totalOrders || 0}</span>
                <span className="stat-label">Total Orders</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-emoji">🌟</span>
                <span className="stat-value">{stats?.todayOrders || 0}</span>
                <span className="stat-label">Today</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-emoji">⏳</span>
                <span className="stat-value">{stats?.pendingOrders || 0}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-emoji">💵</span>
                <span className="stat-value">₹{stats?.todayRevenue?.toLocaleString() || 0}</span>
                <span className="stat-label">Today's Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;

