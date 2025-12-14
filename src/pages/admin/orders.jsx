import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const AdminOrders = () => {
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', emoji: '⏳' },
    { value: 'confirmed', label: 'Confirmed', emoji: '✅' },
    { value: 'preparing', label: 'Preparing', emoji: '👨‍🍳' },
    { value: 'ready', label: 'Ready', emoji: '🍽️' },
    { value: 'out_for_delivery', label: 'Out for Delivery', emoji: '🛵' },
    { value: 'delivered', label: 'Delivered', emoji: '🎉' },
    { value: 'cancelled', label: 'Cancelled', emoji: '❌' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/orders/restaurant/all`;
      if (filter !== 'all') {
        url = `${API_URL}/orders/restaurant/by-status?status=${filter}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, message = '') => {
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/orders/restaurant/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          statusMessage: message,
        }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(o => o._id === orderId ? updatedOrder : o));
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
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

  const getNextStatus = (currentStatus) => {
    const flow = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentIndex = flow.indexOf(currentStatus);
    if (currentIndex < flow.length - 1) {
      return flow[currentIndex + 1];
    }
    return null;
  };

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
          <Link to="/admin/orders" className="nav-item active">
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Orders</h1>
            <p>Manage your restaurant orders</p>
          </div>
          <button onClick={fetchOrders} className="refresh-btn">
            🔄 Refresh
          </button>
        </header>

        {/* Filters */}
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          {statusOptions.slice(0, 5).map(status => (
            <button
              key={status.value}
              className={filter === status.value ? 'active' : ''}
              onClick={() => setFilter(status.value)}
            >
              {status.emoji} {status.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <span>📦</span>
            <h3>No orders found</h3>
            <p>Orders matching your filter will appear here</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">{order.orderId}</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="order-item">
                    <h4>{order.foodTitle}</h4>
                    <span className="quantity">x{order.quantity}</span>
                  </div>
                  
                  <div className="order-customer">
                    <p><strong>👤</strong> {order.customerName}</p>
                    <p><strong>📞</strong> {order.customerPhone}</p>
                    <p><strong>📍</strong> {order.deliveryAddress}</p>
                  </div>

                  {order.notes && (
                    <div className="order-notes">
                      <p><strong>📝 Notes:</strong> {order.notes}</p>
                    </div>
                  )}

                  <div className="order-pricing">
                    {order.discountAmount > 0 && (
                      <p className="discount">
                        <span>🏷️ Discount:</span> -₹{order.discountAmount}
                      </p>
                    )}
                    <p className="total">
                      <span>Total:</span> ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="order-card-footer">
                  <span className="order-time">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                  
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="order-actions">
                      {getNextStatus(order.status) && (
                        <button
                          className="action-btn primary"
                          onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                          disabled={updating}
                        >
                          {statusOptions.find(s => s.value === getNextStatus(order.status))?.emoji}{' '}
                          Mark as {statusOptions.find(s => s.value === getNextStatus(order.status))?.label}
                        </button>
                      )}
                      <button
                        className="action-btn danger"
                        onClick={() => updateOrderStatus(order._id, 'cancelled', 'Order cancelled by restaurant')}
                        disabled={updating}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;

