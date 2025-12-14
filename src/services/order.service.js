/**
 * Order Service
 * 
 * Handles order-related operations including creation, updates,
 * and integration with email notifications
 * 
 * NOTE: Orders are processed locally and via automation webhooks.
 * The Contentstack Delivery SDK is read-only, so order entries 
 * can be created via MCP tools or backend APIs if needed.
 */

/**
 * OrderService - Service class for order management
 */
class OrderService {
  constructor() {
    // Orders are stored locally in session and sent via automation
    this.orders = [];
  }

  /**
   * Create a new order
   * @param {Object} orderData
   * @param {string} orderData.customerName
   * @param {string} orderData.email
   * @param {string} orderData.phone
   * @param {string} orderData.deliveryAddress
   * @param {Object} orderData.foodItem
   * @param {number} orderData.quantity
   * @param {number} orderData.totalPrice
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    try {
      // Generate order ID
      const orderId = this.generateOrderId();
      
      // Prepare order entry
      const order = {
        order_id: orderId,
        customer_name: orderData.customerName,
        email: orderData.email,
        phone: orderData.phone,
        delivery_address: orderData.deliveryAddress,
        food_item: {
          uid: orderData.foodItem.uid,
          title: orderData.foodItem.title,
          restaurant_name: orderData.foodItem.restaurant_name,
          restaurant_uid: orderData.foodItem.restaurant_uid
        },
        quantity: orderData.quantity,
        total_price: orderData.totalPrice,
        order_status: 'confirmed',
        order_date: new Date().toISOString(),
        notes: orderData.notes || ''
      };

      console.log('[OrderService] Creating order:', orderId);

      // Store order locally (in production, this would go to a backend)
      this.orders.push(order);
      
      // Store in sessionStorage for persistence during session
      try {
        const existingOrders = JSON.parse(sessionStorage.getItem('foody_orders') || '[]');
        existingOrders.push(order);
        sessionStorage.setItem('foody_orders', JSON.stringify(existingOrders));
      } catch (storageError) {
        console.warn('[OrderService] Could not save to sessionStorage:', storageError);
      }

      return {
        success: true,
        orderId,
        order,
        message: 'Order created successfully'
      };
    } catch (error) {
      console.error('[OrderService] Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get all orders (from local storage)
   * @returns {Promise<Array>}
   */
  async getAllOrders() {
    try {
      // Get orders from sessionStorage
      const storedOrders = JSON.parse(sessionStorage.getItem('foody_orders') || '[]');
      return [...this.orders, ...storedOrders];
    } catch (error) {
      console.error('[OrderService] Error fetching orders:', error);
      return this.orders;
    }
  }

  /**
   * Get orders by customer email
   * @param {string} email - Customer email
   * @returns {Promise<Array>}
   */
  async getOrdersByEmail(email) {
    try {
      const allOrders = await this.getAllOrders();
      return allOrders.filter(order => order.email === email);
    } catch (error) {
      console.error('[OrderService] Error fetching orders by email:', error);
      throw error;
    }
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>}
   */
  async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = [
        'pending', 'confirmed', 'preparing', 
        'out_for_delivery', 'delivered', 'cancelled'
      ];

      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid order status: ${status}`);
      }

      console.log(`[OrderService] Updating order ${orderId} to status: ${status}`);

      // Update in local storage
      const storedOrders = JSON.parse(sessionStorage.getItem('foody_orders') || '[]');
      const updatedOrders = storedOrders.map(order => {
        if (order.order_id === orderId) {
          return { ...order, order_status: status };
        }
        return order;
      });
      sessionStorage.setItem('foody_orders', JSON.stringify(updatedOrders));

      return {
        success: true,
        message: 'Order status updated',
        orderId,
        status
      };
    } catch (error) {
      console.error('[OrderService] Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Send order confirmation email
   * @param {Object} orderDetails
   * @returns {Promise<Object>}
   */
  async sendOrderConfirmationEmail(orderDetails) {
    try {
      const emailBody = this.generateEmailBody(orderDetails);
      
      // Prepare email data for automation
      const emailData = {
        to: orderDetails.email,
        subject: `Order Confirmation - ${orderDetails.orderId}`,
        body: emailBody
      };

      console.log('[OrderService] Preparing order confirmation email for:', orderDetails.email);
      
      // Return email data (actual sending handled by automation webhook in Dish.jsx)
      return {
        success: true,
        emailData
      };
    } catch (error) {
      console.error('[OrderService] Error preparing confirmation email:', error);
      throw error;
    }
  }

  /**
   * Generate a unique order ID
   * @returns {string}
   */
  generateOrderId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `ORD-${year}${month}${day}-${random}`;
  }

  /**
   * Generate email body for order confirmation
   * @param {Object} orderDetails
   * @returns {string}
   */
  generateEmailBody(orderDetails) {
    const restaurantName = orderDetails.foodItem?.restaurant_name || 
                          orderDetails.foodItem?.mess_name || 
                          'Restaurant';
    
    return `
Hi ${orderDetails.customerName},

🎉 Your order has been confirmed and will be delivered soon!

📦 Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━
Order ID: ${orderDetails.orderId || 'N/A'}
Food: ${orderDetails.foodItem?.title || 'N/A'}
Restaurant: ${restaurantName}
Quantity: ${orderDetails.quantity}
Total Price: ₹${orderDetails.totalPrice}

🚚 Delivery Information:
━━━━━━━━━━━━━━━━━━━━━━━━
Address: ${orderDetails.deliveryAddress}
Contact: ${orderDetails.phone}

Thank you for ordering with Foody! 🍽️

Best regards,
The Foody Team
━━━━━━━━━━━━━━━━━━━━━━━━
taste the joy
    `.trim();
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object|null>}
   */
  async getOrderById(orderId) {
    try {
      const allOrders = await this.getAllOrders();
      return allOrders.find(order => order.order_id === orderId) || null;
    } catch (error) {
      console.error('[OrderService] Error fetching order by ID:', error);
      throw error;
    }
  }

  /**
   * Clear all orders (for testing)
   */
  clearOrders() {
    this.orders = [];
    sessionStorage.removeItem('foody_orders');
    console.log('[OrderService] All orders cleared');
  }
}

/**
 * Create singleton instance
 */
let orderServiceInstance = null;

/**
 * Get the order service instance
 * @returns {OrderService}
 */
function getOrderService() {
  if (!orderServiceInstance) {
    orderServiceInstance = new OrderService();
  }
  return orderServiceInstance;
}

export {
  OrderService,
  getOrderService
};
