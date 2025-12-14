import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Auth.css';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const isRestaurant = searchParams.get('type') === 'restaurant';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    restaurantUid: '',
    restaurantName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState(isRestaurant ? 'restaurant' : 'consumer');
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isRestaurant) {
      setAccountType('restaurant');
    }
  }, [isRestaurant]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: accountType === 'restaurant' ? 'restaurant_admin' : 'consumer',
      };

      if (accountType === 'restaurant') {
        userData.restaurantUid = formData.restaurantUid;
        userData.restaurantName = formData.restaurantName;
      }

      const user = await signup(userData);
      
      if (user.role === 'restaurant_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-container signup-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">🍽️</div>
              <h1>Create Account</h1>
              <p>Join Foody today</p>
            </div>

            {/* Account Type Toggle */}
            <div className="account-type-toggle">
              <button
                className={accountType === 'consumer' ? 'active' : ''}
                onClick={() => setAccountType('consumer')}
                type="button"
              >
                👤 Customer
              </button>
              <button
                className={accountType === 'restaurant' ? 'active' : ''}
                onClick={() => setAccountType('restaurant')}
                type="button"
              >
                🏪 Restaurant
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="auth-error">{error}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City"
                  />
                </div>
              </div>

              {accountType === 'restaurant' && (
                <>
                  <div className="restaurant-notice">
                    <span>🏪</span>
                    <p>Register as a restaurant admin. A new restaurant will be created in Contentstack automatically!</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="restaurantName">Restaurant Name *</label>
                    <input
                      type="text"
                      id="restaurantName"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      placeholder="My Restaurant"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="restaurantUid">Existing Restaurant UID (optional)</label>
                    <input
                      type="text"
                      id="restaurantUid"
                      name="restaurantUid"
                      value={formData.restaurantUid}
                      onChange={handleChange}
                      placeholder="Leave blank to create new restaurant"
                    />
                    <small style={{ color: '#6B6B78', fontSize: '12px', marginTop: '4px' }}>
                      Only enter if linking to an existing restaurant in Contentstack
                    </small>
                  </div>
                </>
              )}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;

