import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderDocument } from '../orders/schemas/order.schema';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly webhookUrl: string;

  constructor(private configService: ConfigService) {
    this.webhookUrl = this.configService.get('AUTOMATE_WEBHOOK_URL');
  }

  async sendOrderConfirmation(order: OrderDocument): Promise<void> {
    if (!this.webhookUrl) {
      this.logger.warn('AUTOMATE_WEBHOOK_URL not configured. Skipping email.');
      return;
    }

    try {
      const html = this.generateOrderConfirmationEmail(order);

      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.customerEmail,
          subject: `🍽️ Order Confirmed - ${order.orderId}`,
          body: html,
          isHtml: true,
          type: 'order_confirmation',
          orderId: order.orderId,
        }),
      });

      this.logger.log(`Order confirmation email sent to ${order.customerEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send order confirmation: ${error.message}`);
    }
  }

  async sendOrderStatusUpdate(order: OrderDocument): Promise<void> {
    if (!this.webhookUrl) {
      this.logger.warn('AUTOMATE_WEBHOOK_URL not configured. Skipping email.');
      return;
    }

    try {
      const html = this.generateStatusUpdateEmail(order);

      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.customerEmail,
          subject: `📦 Order Update - ${order.orderId}`,
          body: html,
          isHtml: true,
          type: 'order_status_update',
          orderId: order.orderId,
          status: order.status,
        }),
      });

      this.logger.log(`Order status update email sent to ${order.customerEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send status update: ${error.message}`);
    }
  }

  private generateOrderConfirmationEmail(order: OrderDocument): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0A0A0F; color: #FFFFFF; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #16161F; border-radius: 16px; padding: 30px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #2A2A38; }
    .logo { font-size: 32px; font-weight: bold; background: linear-gradient(90deg, #FF6B35, #FFD93D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .success-icon { font-size: 48px; margin: 20px 0; }
    .order-id { background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 217, 61, 0.05)); padding: 15px; border-radius: 12px; text-align: center; margin: 20px 0; }
    .order-id-text { color: #FF6B35; font-size: 24px; font-weight: bold; }
    .section { margin: 20px 0; padding: 15px; background: #1A1A24; border-radius: 8px; }
    .section-title { color: #FFD93D; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; }
    .item-row { display: flex; justify-content: space-between; padding: 10px 0; }
    .total { font-size: 20px; color: #FF6B35; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; color: #6B6B78; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🍽️ Foody</div>
      <p style="color: #B8B8C0; font-style: italic;">taste the joy</p>
    </div>
    
    <div style="text-align: center;">
      <div class="success-icon">✅</div>
      <h1 style="color: #4CAF50;">Order Confirmed!</h1>
      <p>Thank you for your order, <strong>${order.customerName}</strong>!</p>
    </div>
    
    <div class="order-id">
      <p style="color: #6B6B78; margin: 0;">Order ID</p>
      <p class="order-id-text">${order.orderId}</p>
      <p style="color: #6B6B78; margin: 0;">${new Date(order.createdAt).toLocaleString()}</p>
    </div>
    
    <div class="section">
      <div class="section-title">📦 Order Details</div>
      <div class="item-row">
        <span><strong>${order.foodTitle}</strong> x ${order.quantity}</span>
        <span>₹${order.totalAmount}</span>
      </div>
      <p style="color: #FFD93D;">from ${order.restaurantName}</p>
      ${order.discountAmount > 0 ? `<p style="color: #4CAF50;">💰 Discount: -₹${order.discountAmount}</p>` : ''}
    </div>
    
    <div class="section">
      <div class="section-title">🚚 Delivery Address</div>
      <p><strong>${order.customerName}</strong></p>
      <p>${order.deliveryAddress}</p>
      <p>📞 ${order.customerPhone}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <span class="total">Total: ₹${order.totalAmount}</span>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing Foody! 🧡</p>
      <p>If you have questions, contact us at support@foody.com</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private generateStatusUpdateEmail(order: OrderDocument): string {
    const statusEmoji: Record<string, string> = {
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '🍽️',
      out_for_delivery: '🛵',
      delivered: '🎉',
      cancelled: '❌',
    };

    const emoji = statusEmoji[order.status] || '📦';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0A0A0F; color: #FFFFFF; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #16161F; border-radius: 16px; padding: 30px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { font-size: 32px; font-weight: bold; background: linear-gradient(90deg, #FF6B35, #FFD93D); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .status-icon { font-size: 64px; margin: 20px 0; }
    .status { font-size: 24px; font-weight: bold; color: #FF6B35; }
    .section { margin: 20px 0; padding: 15px; background: #1A1A24; border-radius: 8px; }
    .footer { text-align: center; margin-top: 30px; color: #6B6B78; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🍽️ Foody</div>
    </div>
    
    <div style="text-align: center;">
      <div class="status-icon">${emoji}</div>
      <p class="status">${order.status.replace(/_/g, ' ').toUpperCase()}</p>
      ${order.statusMessage ? `<p style="color: #B8B8C0;">${order.statusMessage}</p>` : ''}
      ${order.estimatedDeliveryTime ? `<p style="color: #FFD93D;">⏱️ Estimated: ${order.estimatedDeliveryTime}</p>` : ''}
    </div>
    
    <div class="section">
      <p><strong>Order:</strong> ${order.orderId}</p>
      <p><strong>Item:</strong> ${order.foodTitle} x ${order.quantity}</p>
      <p><strong>Restaurant:</strong> ${order.restaurantName}</p>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing Foody! 🧡</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}
