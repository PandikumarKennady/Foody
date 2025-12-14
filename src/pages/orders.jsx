import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Orders.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const Orders = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [restaurantFilter, setRestaurantFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique restaurants from orders
  const restaurants = [...new Set(orders.map(order => order.restaurantName))];

  const statusOptions = [
    { value: 'all', label: 'All Orders', color: '#B8B8C0' },
    { value: 'pending', label: 'Pending', color: '#FFD93D' },
    { value: 'confirmed', label: 'Confirmed', color: '#4CAF50' },
    { value: 'preparing', label: 'Preparing', color: '#FF9800' },
    { value: 'ready', label: 'Ready', color: '#2196F3' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: '#9C27B0' },
    { value: 'delivered', label: 'Delivered', color: '#4CAF50' },
    { value: 'cancelled', label: 'Cancelled', color: '#F44336' },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, restaurantFilter, dateFrom, dateTo, searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/my-orders`, {
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

  const applyFilters = () => {
    let result = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Restaurant filter
    if (restaurantFilter) {
      result = result.filter(order => order.restaurantName === restaurantFilter);
    }

    // Date from filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter(order => new Date(order.createdAt) >= fromDate);
    }

    // Date to filter
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(order => new Date(order.createdAt) <= toDate);
    }

    // Search query (order ID or food title)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderId?.toLowerCase().includes(query) ||
        order.foodTitle?.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(result);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setRestaurantFilter('');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(s => s.value === status);
    return option ? option.color : '#6B6B78';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '🍽️',
      out_for_delivery: '🛵',
      delivered: '🎉',
      cancelled: '❌',
    };
    return emojis[status] || '📦';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="orders-page">
          <div className="orders-container">
            <div className="orders-empty">
              <span className="empty-icon">🔐</span>
              <h2>Please Login</h2>
              <p>You need to be logged in to view your orders</p>
              <Link to="/login" className="login-btn">Login</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="orders-page">
        <div className="orders-container">
          {/* Header */}
          <div className="orders-header">
            <div className="header-content">
              <h1>My Orders</h1>
              <p>Track and manage your food orders</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-value">{orders.length}</span>
                <span className="stat-label">Total Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                </span>
                <span className="stat-label">Active</span>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-row">
              {/* Search */}
              <div className="filter-group search-group">
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Order ID or food name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input"
                />
              </div>

              {/* Status Filter */}
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Restaurant Filter */}
              <div className="filter-group">
                <label>Restaurant</label>
                <select
                  value={restaurantFilter}
                  onChange={(e) => setRestaurantFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Restaurants</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant} value={restaurant}>
                      {restaurant}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filters-row">
              {/* Date From */}
              <div className="filter-group">
                <label>From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="filter-input"
                />
              </div>

              {/* Date To */}
              <div className="filter-group">
                <label>To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="filter-input"
                />
              </div>

              {/* Clear Filters */}
              <div className="filter-group">
                <label>&nbsp;</label>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(statusFilter !== 'all' || restaurantFilter || dateFrom || dateTo || searchQuery) && (
              <div className="active-filters">
                <span className="active-filters-label">Active filters:</span>
                {statusFilter !== 'all' && (
                  <span className="filter-tag">
                    Status: {statusOptions.find(s => s.value === statusFilter)?.label}
                    <button onClick={() => setStatusFilter('all')}>×</button>
                  </span>
                )}
                {restaurantFilter && (
                  <span className="filter-tag">
                    Restaurant: {restaurantFilter}
                    <button onClick={() => setRestaurantFilter('')}>×</button>
                  </span>
                )}
                {dateFrom && (
                  <span className="filter-tag">
                    From: {dateFrom}
                    <button onClick={() => setDateFrom('')}>×</button>
                  </span>
                )}
                {dateTo && (
                  <span className="filter-tag">
                    To: {dateTo}
                    <button onClick={() => setDateTo('')}>×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="filter-tag">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')}>×</button>
                  </span>
                )}
              </div>
            )}

            <div className="filter-results">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="orders-loading">
              <div className="loading-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="orders-empty">
              <span className="empty-icon">📦</span>
              <h2>No orders found</h2>
              <p>
                {orders.length === 0 
                  ? "You haven't placed any orders yet" 
                  : "No orders match your current filters"}
              </p>
              {orders.length === 0 ? (
                <Link to="/foods" className="browse-btn">Browse Menu</Link>
              ) : (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-info">
                      <span className="order-id">{order.orderId}</span>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                    <span 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusEmoji(order.status)} {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <div className="order-item-details">
                      <h3 className="food-title">{order.foodTitle}</h3>
                      <p className="restaurant-name">
                        <span>🏪</span> {order.restaurantName}
                      </p>
                      <p className="quantity">
                        <span>📦</span> Quantity: {order.quantity}
                      </p>
                    </div>

                    <div className="order-pricing">
                      {order.discountAmount > 0 && (
                        <p className="discount">
                          <span>🏷️</span> Discount: -₹{order.discountAmount}
                        </p>
                      )}
                      <p className="total-amount">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <div className="delivery-address">
                      <span>📍</span> {order.deliveryAddress}
                    </div>
                    {order.statusMessage && (
                      <div className="status-message">
                        <span>💬</span> {order.statusMessage}
                      </div>
                    )}
                    {order.estimatedDeliveryTime && (
                      <div className="delivery-time">
                        <span>⏱️</span> Est. Delivery: {order.estimatedDeliveryTime}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;

