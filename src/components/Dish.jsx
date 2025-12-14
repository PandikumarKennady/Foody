import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCardDishResponse } from "../helper/index";
import EmailTemplateService from "../services/email-template.service";
import { FaPlus, FaMinus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import '../styles/Dish.css'
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";

// Backend API URL for creating orders
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
// Contentstack Automate webhook URL for sending emails
const AUTOMATE_WEBHOOK_URL = process.env.REACT_APP_AUTOMATE_WEBHOOK_URL;

export default function Dish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const [nos, setNos] = useState(1)
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [showModel, setShowModel] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: ""
  });

  const [dishes, setDishes] = useState({});

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  async function getDishesInfo() {
    try {
      setLoading(true);
      setError(null);
      const res = await getCardDishResponse(id);
      setDishes(res);
    } catch (err) {
      console.error('Error fetching dish:', err);
      setError('Failed to load dish details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDishesInfo();
  }, [id])

  function handleIncrement() {
    setNos((nos) => nos + 1);

  }

  function handleDecrement() {
    if (nos == 1) {
      return;
    }
    setNos((nos) => nos - 1)

  }

  function confirmOrder() {
    // Pre-fill form with authenticated user's details
    if (isAuthenticated && user) {
      setForm({
        username: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
    setShowModel(true);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create order using the NestJS backend API
      const orderData = {
        customerName: form.username,
        customerEmail: form.email,
        customerPhone: form.phone,
        deliveryAddress: form.address,
        foodUid: dishes.uid,
        foodTitle: dishes.title,
        restaurantUid: dishes?.restaurant_details?.[0]?.uid || '',
        restaurantName: dishes?.restaurant_details?.[0]?.title || dishes?.mess_name || 'Restaurant',
        restaurantEmail: dishes?.restaurant_details?.[0]?.email || '',
        originalPrice: dishes?.rate || 0,
        quantity: nos,
        notes: ''
      };

      // Build headers (include auth token if logged in)
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Create order via backend API
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderResult = await response.json();
      console.log('Order created in MongoDB:', orderResult);

      // Generate beautiful HTML email template
      const htmlEmailBody = EmailTemplateService.generateOrderConfirmationEmail({
        orderId: orderResult.orderId,
        customerName: form.username,
        email: form.email,
        phone: form.phone,
        deliveryAddress: form.address,
        foodItem: {
          title: dishes.title,
          restaurant_name: dishes?.restaurant_details?.[0]?.title || dishes?.mess_name || 'Restaurant'
        },
        quantity: nos,
        totalPrice: price,
        orderDate: new Date().toISOString()
      });

      // Send emails via Contentstack Automate webhook (if configured)
      if (AUTOMATE_WEBHOOK_URL) {
        // Get restaurant email from restaurant_details reference
        const restaurantEmail = dishes?.restaurant_details?.[0]?.email || null;
        const restaurantName = dishes?.restaurant_details?.[0]?.title || dishes?.mess_name || 'Restaurant';

        console.log('[Dish] Restaurant details:', dishes?.restaurant_details);
        console.log('[Dish] Restaurant email:', restaurantEmail);
        console.log('[Dish] Restaurant name:', restaurantName);

        // Generate restaurant notification email
        const restaurantEmailBody = EmailTemplateService.generateRestaurantOrderEmail({
          orderId: orderResult.orderId,
          customerName: form.username,
          customerEmail: form.email,
          customerPhone: form.phone,
          deliveryAddress: form.address,
          foodItem: {
            title: dishes.title,
            restaurant_name: restaurantName
          },
          quantity: nos,
          totalPrice: price,
          orderDate: new Date().toISOString(),
          notes: orderData.notes || ''
        });

        // Send customer email first
        try {
          await axios.post(AUTOMATE_WEBHOOK_URL, { 
            to: form.email,
            subject: `🍽️ Order Confirmed - ${orderResult.orderId}`,
            body: htmlEmailBody,
            isHtml: true,
            type: 'customer',
            orderId: orderResult.orderId
          });
          console.log('[Dish] Customer email sent to:', form.email);
        } catch (emailError) {
          console.error('[Dish] Customer email failed:', emailError);
        }

        // Send vendor/restaurant email with 50ms delay
        if (restaurantEmail) {
          await new Promise(resolve => setTimeout(resolve, 50));
          try {
            await axios.post(AUTOMATE_WEBHOOK_URL, { 
              to: restaurantEmail,
              subject: `🔔 New Order - ${orderResult.orderId} | Foody`,
              body: restaurantEmailBody,
              isHtml: true,
              type: 'restaurant',
              orderId: orderResult.orderId
            });
            console.log('[Dish] Restaurant email sent to:', restaurantEmail);
          } catch (emailError) {
            console.error('[Dish] Restaurant email failed:', emailError);
          }
        } else {
          console.warn('[Dish] Restaurant email not found in reference data');
        }
      } else {
        console.warn('[Dish] Email webhook URL not configured. Skipping email notifications.');
        console.log('[Dish] To enable emails, add REACT_APP_AUTOMATE_WEBHOOK_URL to your .env file');
      }

      // Close modal
      setShowModel(false);
      
      // Reset form
      setForm({
        username: "",
        email: "",
        phone: "",
        address: ""
      });
      setNos(1);
      setIsSubmitting(false);

      // Show success toast
      showToast(`Order Confirmed! Order ID: ${orderResult.orderId}`, 'success');

      // Redirect to menu page after short delay
      setTimeout(() => {
        navigate('/foods');
      }, 2000);

    } catch (err) {
      console.error('Error submitting order:', err);
      setIsSubmitting(false);
      setShowModel(false);
      showToast('Failed to process your order. Please try again.', 'error');
    }
  }

  const handleCancel = () => {
    setShowModel(false);
  }

  useEffect(() => {
    if (dishes?.rate) {
      let new_price = nos === (0 || 1) ? dishes.rate : dishes.rate * nos;
      setPrice(new_price);
    }
  }, [nos, dishes]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dish-container">
          <div className="dish-loading">
            <div className="loading-spinner"></div>
            <h2>Loading dish details...</h2>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="dish-container">
          <div className="error-container">
            <span style={{ fontSize: '4rem' }}>😕</span>
            <h2>{error}</h2>
            <Link to="/foods" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Menu
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Navbar />
    
    {/* Toast Notification */}
    {toast.show && (
      <div className={`toast-notification ${toast.type}`}>
        <div className="toast-icon">
          {toast.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>
        <span className="toast-message">{toast.message}</span>
      </div>
    )}

    <article className="dish-container">
      <h1 className="dish-header">Discover our Dishes!</h1>
      <div className="dish-content">

        <div className="left-section">
          <img
            src={dishes?.dish_image?.url}
            alt={dishes?.dish_image?.filename}
            className="dish-image"
          />
        </div>


        <div className="right-sections">

          <div className="parallel-section">
            <div className="left-parallel">
              <h2 className="dish-title">{dishes?.title}</h2>
              <h3 className="mess-name">{dishes?.restaurant_details?.[0]?.title || dishes?.mess_name || 'Restaurant'}</h3>
              <address className="mess-address">{dishes?.restaurant_details?.[0]?.address || dishes?.mess_address || ''}</address>
            </div>
            <div className="right-parallel">
              <p className="ratings">Rating: {dishes?.ratings?.value}</p>
              <p className="avail-time">
                {dishes?.avail_from} - {dishes?.avail_until}
              </p>
            </div>
          </div>


          <section className="description-section">
            <h3>Description</h3>
            <p>{dishes?.description}</p>
            <h3>Main Ingredients</h3>
            <p>{dishes?.ingredients}</p>
          </section>


          <ul className="categories">
            {dishes?.category?.map((dish, idx) => (
              <li key={idx} className="category-item">
                <h4>#{dish}</h4>
              </li>
            ))}
          </ul>

          {/* Price and Quantity */}
          <div className="price-quantity-section">
            <button onClick={handleIncrement} className="quantity-button">
              <FaPlus />
            </button>
            <p className="quantity">Quantity: {nos}</p>
            <button onClick={handleDecrement} className="quantity-button">
              <FaMinus />
            </button>
            <h3 className="price">
              Price: {price}
            </h3>
          </div>


          <button className="order-button" onClick={confirmOrder}>Order</button>
        </div>
      </div>

      {/* Form for Confirming Order*/}
      {showModel && (
        <div className="modal">
          <div className="modal-content">
            <h2>Order Details</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                required
                placeholder="Enter Customer Name"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your mail"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your Phone No"
              />
              <input
                type="text-area"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                required
                placeholder="Type Delivery Address"
              />
              {/* Order Summary */}
              <div className="order-summary">
                <p>
                  <strong>Food:</strong> {dishes?.title}
                </p>
                <p>
                  <strong>Restaurant:</strong> {dishes?.restaurant_details?.[0]?.title || dishes?.mess_name || 'Restaurant'}
                </p>
                <p>
                  <strong>Quantity:</strong> {nos}
                </p>
                <p className="total-line">
                  <strong>Total:</strong> <strong className="final-amount">₹{price}</strong>
                </p>
              </div>


              <div className="modal-actions">
                <button type="submit" className="confirm-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Confirm Order'}
                </button>
                <button type="button" onClick={handleCancel} className="cancel-button" disabled={isSubmitting}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
    <Footer />
    </>
  );
}
