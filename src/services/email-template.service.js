/**
 * Email Template Service
 * 
 * Enterprise-level HTML email templates for Foody
 * Aligned with brand theme and design system
 */

/**
 * Brand Design System
 */
const BRAND = {
  // Colors
  primary: '#FF6B35',
  secondary: '#FFD93D',
  accent: '#FF8C42',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#2196F3',
  
  // Dark Theme
  bgDark: '#0A0A0F',
  bgCard: '#16161F',
  bgCardAlt: '#1A1A24',
  bgElevated: '#222230',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B8B8C0',
  textMuted: '#6B6B78',
  
  // Borders
  borderColor: '#2A2A38',
  borderGlow: 'rgba(255, 107, 53, 0.3)',
  
  // Typography
  fontPrimary: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  fontDisplay: "Georgia, 'Times New Roman', serif",
  
  // Company Info
  companyName: 'Foody',
  tagline: 'taste the joy',
  website: 'https://foody.com',
  supportEmail: 'support@foody.com',
  supportPhone: '+91 98765 43210',
  address: '123 Food Street, Chennai, Tamil Nadu 600001, India'
};

/**
 * Generate Enterprise Email Header with Logo (Table-based for proper alignment)
 */
function generateHeader() {
  return `
    <!-- Preheader (Preview Text) -->
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
      Foody - Fresh, delicious food delivered from the best local restaurants. Taste the joy!
    </div>
    
    <!-- Header Container -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.accent} 50%, ${BRAND.secondary} 100%);">
      <tr>
        <td align="center" style="padding: 30px 20px;">
          
          <!-- Logo and Brand Name Row -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <!-- Logo Circle -->
              <td align="center" valign="middle" style="width: 60px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: #FFFFFF; border-radius: 30px;">
                  <tr>
                    <td align="center" valign="middle" style="width: 56px; height: 56px; padding: 8px;">
                      <!-- Simple Fork & Bowl Icon using text -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="font-size: 28px; line-height: 1;">🍽️</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              
              <!-- Brand Text -->
              <td valign="middle" style="padding-left: 15px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px;">
                        Foody
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin: 4px 0 0 0; font-family: Georgia, serif; font-style: italic; font-size: 13px; color: rgba(255,255,255,0.9); letter-spacing: 0.5px;">
                        ${BRAND.tagline}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generate Enterprise Email Footer (Simplified - No Track Order)
 */
function generateFooter() {
  const year = new Date().getFullYear();
  
  return `
    <!-- Footer Container -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: ${BRAND.bgCard}; border-top: 1px solid ${BRAND.borderColor};">
      <tr>
        <td style="padding: 35px 30px;">
          
          <!-- Quick Links -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <a href="${BRAND.website}/help" style="color: ${BRAND.primary}; text-decoration: none; font-size: 13px; font-weight: 500; margin: 0 12px;">Help Center</a>
                <span style="color: ${BRAND.textMuted};">|</span>
                <a href="${BRAND.website}/contact" style="color: ${BRAND.primary}; text-decoration: none; font-size: 13px; font-weight: 500; margin: 0 12px;">Contact Us</a>
                <span style="color: ${BRAND.textMuted};">|</span>
                <a href="${BRAND.website}/restaurants" style="color: ${BRAND.primary}; text-decoration: none; font-size: 13px; font-weight: 500; margin: 0 12px;">Restaurants</a>
              </td>
            </tr>
          </table>
          
          <!-- Divider -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="border-top: 1px solid ${BRAND.borderColor}; padding-top: 20px;">
                
                <!-- Company Info -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center">
                      <p style="margin: 0 0 8px 0; color: ${BRAND.textSecondary}; font-size: 13px; font-family: ${BRAND.fontPrimary};">
                        Thank you for choosing <span style="color: ${BRAND.primary}; font-weight: 600;">Foody</span>! 🧡
                      </p>
                      <p style="margin: 0 0 8px 0; color: ${BRAND.textMuted}; font-size: 12px; font-family: ${BRAND.fontPrimary};">
                        ${BRAND.address}
                      </p>
                      <p style="margin: 0 0 15px 0; color: ${BRAND.textMuted}; font-size: 12px; font-family: ${BRAND.fontPrimary};">
                        Phone: ${BRAND.supportPhone} | Email: ${BRAND.supportEmail}
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Copyright -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center">
                      <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 11px; font-family: ${BRAND.fontPrimary};">
                        © ${year} Foody Technologies Pvt. Ltd. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generate Info Card
 */
function generateInfoCard(title, icon, content) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: ${BRAND.bgCardAlt}; border: 1px solid ${BRAND.borderColor}; border-radius: 12px; margin-bottom: 20px;">
      <tr>
        <td style="padding: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding-bottom: 16px;">
                <span style="font-size: 16px; margin-right: 10px;">${icon}</span>
                <span style="color: ${BRAND.textPrimary}; font-size: 15px; font-weight: 600; font-family: ${BRAND.fontPrimary};">${title}</span>
              </td>
            </tr>
            <tr>
              <td>
                ${content}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generate Order Confirmation Email - Enterprise Level (Simplified)
 */
function generateOrderConfirmationEmail(orderDetails) {
  const {
    orderId,
    customerName,
    email,
    phone,
    deliveryAddress,
    foodItem,
    quantity,
    totalPrice,
    orderDate,
    estimatedDelivery,
    paymentMethod = 'Cash on Delivery'
  } = orderDetails;

  const restaurantName = foodItem?.restaurant_name || 'Partner Restaurant';
  const foodTitle = foodItem?.title || 'Food Item';
  const formattedDate = orderDate 
    ? new Date(orderDate).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
    : new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });
  
  const deliveryTime = estimatedDelivery || '30-45 minutes';

  // Order Details Card Content
  const orderDetailsContent = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <!-- Item Row -->
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${BRAND.borderColor};">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="vertical-align: top;">
                <p style="margin: 0 0 4px 0; color: ${BRAND.textPrimary}; font-size: 16px; font-weight: 600; font-family: ${BRAND.fontPrimary};">${foodTitle}</p>
                <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 13px; font-family: ${BRAND.fontPrimary};">from <span style="color: ${BRAND.secondary};">${restaurantName}</span></p>
              </td>
              <td style="text-align: right; vertical-align: top; width: 100px;">
                <p style="margin: 0 0 4px 0; color: ${BRAND.textSecondary}; font-size: 13px; font-family: ${BRAND.fontPrimary};">x ${quantity}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Subtotal -->
      <tr>
        <td style="padding: 10px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="color: ${BRAND.textSecondary}; font-size: 14px; font-family: ${BRAND.fontPrimary};">Subtotal</td>
              <td style="text-align: right; color: ${BRAND.textPrimary}; font-size: 14px; font-family: ${BRAND.fontPrimary};">₹${totalPrice}</td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Delivery -->
      <tr>
        <td style="padding: 6px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="color: ${BRAND.textSecondary}; font-size: 14px; font-family: ${BRAND.fontPrimary};">Delivery Fee</td>
              <td style="text-align: right; color: ${BRAND.success}; font-size: 14px; font-weight: 600; font-family: ${BRAND.fontPrimary};">FREE</td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Total -->
      <tr>
        <td style="padding: 14px 0 0 0; border-top: 1px dashed ${BRAND.borderColor};">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="color: ${BRAND.textPrimary}; font-size: 18px; font-weight: 700; font-family: ${BRAND.fontPrimary};">Total Amount</td>
              <td style="text-align: right; color: ${BRAND.primary}; font-size: 20px; font-weight: 700; font-family: ${BRAND.fontPrimary};">₹${totalPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top: 6px;">
                <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 12px; font-family: ${BRAND.fontPrimary};">Payment: ${paymentMethod}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  // Delivery Info Content
  const deliveryContent = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding-bottom: 12px;">
          <p style="margin: 0 0 4px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Delivering To</p>
          <p style="margin: 0; color: ${BRAND.textPrimary}; font-size: 15px; font-weight: 600; font-family: ${BRAND.fontPrimary};">${customerName}</p>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px;">
          <p style="margin: 0 0 4px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Address</p>
          <p style="margin: 0; color: ${BRAND.textSecondary}; font-size: 14px; line-height: 1.5; font-family: ${BRAND.fontPrimary};">${deliveryAddress}</p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin: 0 0 4px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Contact</p>
          <p style="margin: 0; color: ${BRAND.textSecondary}; font-size: 14px; font-family: ${BRAND.fontPrimary};">
            Phone: ${phone}<br/>
            Email: ${email}
          </p>
        </td>
      </tr>
    </table>
  `;

  // Order Status - Simple Confirmed Only
  const orderStatusContent = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <!-- Green Checkmark Circle -->
              <td valign="top" style="width: 32px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND.success}; border-radius: 16px;">
                  <tr>
                    <td align="center" valign="middle" style="width: 32px; height: 32px; color: #FFFFFF; font-size: 16px; font-weight: bold;">
                      ✓
                    </td>
                  </tr>
                </table>
              </td>
              <!-- Status Text -->
              <td valign="middle" style="padding-left: 14px;">
                <p style="margin: 0 0 2px 0; color: ${BRAND.success}; font-size: 16px; font-weight: 600; font-family: ${BRAND.fontPrimary};">Order Confirmed</p>
                <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 13px; font-family: ${BRAND.fontPrimary};">Your order has been received and confirmed</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Order Confirmation - Foody</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.bgDark}; font-family: ${BRAND.fontPrimary};">
  
  <!-- Email Container -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND.bgDark};">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        
        <!-- Email Wrapper -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background: ${BRAND.bgCard}; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td>
              ${generateHeader()}
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 35px 30px;">
              
              <!-- Success Hero Section -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <!-- Success Checkmark Circle -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(76, 175, 80, 0.15); border: 3px solid ${BRAND.success}; border-radius: 40px; margin-bottom: 20px;">
                      <tr>
                        <td align="center" valign="middle" style="width: 72px; height: 72px; color: ${BRAND.success}; font-size: 36px; font-weight: bold;">
                          ✓
                        </td>
                      </tr>
                    </table>
                    
                    <h1 style="margin: 0 0 10px 0; color: ${BRAND.success}; font-size: 26px; font-weight: 700; font-family: ${BRAND.fontPrimary};">
                      Order Confirmed!
                    </h1>
                    <p style="margin: 0; color: ${BRAND.textSecondary}; font-size: 15px; line-height: 1.5; font-family: ${BRAND.fontPrimary};">
                      Thank you for your order, <span style="color: ${BRAND.textPrimary}; font-weight: 600;">${customerName}</span>!
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Order ID Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 217, 61, 0.05) 100%); border: 1px solid ${BRAND.borderGlow}; border-radius: 12px; margin-bottom: 25px;">
                <tr>
                  <td align="center" style="padding: 22px;">
                    <p style="margin: 0 0 5px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-family: ${BRAND.fontPrimary};">Order ID</p>
                    <p style="margin: 0 0 10px 0; color: ${BRAND.primary}; font-size: 22px; font-weight: 700; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">${orderId}</p>
                    <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 12px; font-family: ${BRAND.fontPrimary};">${formattedDate}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Estimated Delivery Banner -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: ${BRAND.bgElevated}; border-radius: 8px; margin-bottom: 22px;">
                <tr>
                  <td align="center" style="padding: 14px 18px;">
                    <p style="margin: 0; color: ${BRAND.textSecondary}; font-size: 13px; font-family: ${BRAND.fontPrimary};">
                      Estimated Delivery: <span style="color: ${BRAND.secondary}; font-weight: 600;">${deliveryTime}</span>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Order Details Card -->
              ${generateInfoCard('Order Details', '📦', orderDetailsContent)}
              
              <!-- Delivery Info Card -->
              ${generateInfoCard('Delivery Information', '🚚', deliveryContent)}
              
              <!-- Order Status Card - Simple -->
              ${generateInfoCard('Order Status', '📍', orderStatusContent)}
              
              <!-- Help Section -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 25px; padding-top: 20px; border-top: 1px solid ${BRAND.borderColor};">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; color: ${BRAND.textSecondary}; font-size: 13px; font-family: ${BRAND.fontPrimary};">
                      Need help with your order?
                    </p>
                    <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 12px; font-family: ${BRAND.fontPrimary};">
                      Contact us at <a href="mailto:${BRAND.supportEmail}" style="color: ${BRAND.primary}; text-decoration: none;">${BRAND.supportEmail}</a>
                      or call <a href="tel:${BRAND.supportPhone}" style="color: ${BRAND.primary}; text-decoration: none;">${BRAND.supportPhone}</a>
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td>
              ${generateFooter()}
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}

/**
 * Generate Order Status Update Email (Simplified)
 */
function generateOrderStatusEmail(details) {
  const { orderId, customerName, status, statusMessage, foodTitle, restaurantName } = details;
  
  const statusConfig = {
    confirmed: { icon: '✓', color: BRAND.success, title: 'Order Confirmed' },
    preparing: { icon: '👨‍🍳', color: BRAND.warning, title: 'Your Order is Being Prepared' },
    out_for_delivery: { icon: '🛵', color: BRAND.info, title: 'Your Order is On Its Way' },
    delivered: { icon: '🎉', color: BRAND.success, title: 'Order Delivered!' },
    cancelled: { icon: '❌', color: BRAND.danger, title: 'Order Cancelled' }
  };

  const config = statusConfig[status] || { icon: '📦', color: BRAND.primary, title: 'Order Update' };
  const message = statusMessage || `Your order #${orderId} status has been updated.`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - Foody</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.bgDark}; font-family: ${BRAND.fontPrimary};">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND.bgDark};">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background: ${BRAND.bgCard}; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td>
              ${generateHeader()}
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td align="center" style="padding: 40px 30px;">
              
              <!-- Status Icon -->
              <p style="font-size: 56px; margin: 0 0 20px 0;">${config.icon}</p>
              
              <!-- Title -->
              <h1 style="margin: 0 0 12px 0; color: ${config.color}; font-size: 24px; font-weight: 700; font-family: ${BRAND.fontPrimary};">
                ${config.title}
              </h1>
              
              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: ${BRAND.textSecondary}; font-size: 15px; font-family: ${BRAND.fontPrimary};">
                Hi ${customerName},
              </p>
              
              <!-- Message -->
              <p style="margin: 0 0 25px 0; color: ${BRAND.textPrimary}; font-size: 15px; line-height: 1.6; font-family: ${BRAND.fontPrimary};">
                ${message}
              </p>
              
              <!-- Order Info Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: ${BRAND.bgCardAlt}; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td align="center" style="padding: 22px;">
                    <p style="margin: 0 0 5px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Order ID</p>
                    <p style="margin: 0 0 12px 0; color: ${BRAND.primary}; font-size: 18px; font-weight: 700; font-family: ${BRAND.fontPrimary};">${orderId}</p>
                    ${foodTitle ? `<p style="margin: 0; color: ${BRAND.textSecondary}; font-size: 13px; font-family: ${BRAND.fontPrimary};">${foodTitle} from ${restaurantName || 'Restaurant'}</p>` : ''}
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td>
              ${generateFooter()}
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}

/**
 * Generate Welcome Email
 */
function generateWelcomeEmail(details) {
  const { customerName } = details;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Foody!</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.bgDark}; font-family: ${BRAND.fontPrimary};">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND.bgDark};">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background: ${BRAND.bgCard}; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td>
              ${generateHeader()}
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td align="center" style="padding: 40px 30px;">
              
              <!-- Welcome Icon -->
              <p style="font-size: 56px; margin: 0 0 20px 0;">🎉</p>
              
              <!-- Title -->
              <h1 style="margin: 0 0 12px 0; color: ${BRAND.textPrimary}; font-size: 28px; font-weight: 700; font-family: ${BRAND.fontPrimary};">
                Welcome to <span style="color: ${BRAND.primary};">Foody</span>!
              </h1>
              
              <!-- Greeting -->
              <p style="margin: 0 0 25px 0; color: ${BRAND.textSecondary}; font-size: 15px; line-height: 1.6; font-family: ${BRAND.fontPrimary};">
                Hi <span style="color: ${BRAND.textPrimary}; font-weight: 600;">${customerName}</span>,<br/>
                We're thrilled to have you join our foodie family!
              </p>
              
              <!-- Features Grid -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 25px;">
                <tr>
                  <td align="center" valign="top" style="width: 33%; padding: 12px;">
                    <p style="font-size: 28px; margin: 0 0 8px 0;">🍕</p>
                    <p style="margin: 0; color: ${BRAND.textPrimary}; font-size: 13px; font-weight: 600; font-family: ${BRAND.fontPrimary};">Delicious Food</p>
                    <p style="margin: 4px 0 0 0; color: ${BRAND.textMuted}; font-size: 11px; font-family: ${BRAND.fontPrimary};">Fresh from top restaurants</p>
                  </td>
                  <td align="center" valign="top" style="width: 33%; padding: 12px;">
                    <p style="font-size: 28px; margin: 0 0 8px 0;">🚀</p>
                    <p style="margin: 0; color: ${BRAND.textPrimary}; font-size: 13px; font-weight: 600; font-family: ${BRAND.fontPrimary};">Fast Delivery</p>
                    <p style="margin: 4px 0 0 0; color: ${BRAND.textMuted}; font-size: 11px; font-family: ${BRAND.fontPrimary};">Right to your doorstep</p>
                  </td>
                  <td align="center" valign="top" style="width: 33%; padding: 12px;">
                    <p style="font-size: 28px; margin: 0 0 8px 0;">💝</p>
                    <p style="margin: 0; color: ${BRAND.textPrimary}; font-size: 13px; font-weight: 600; font-family: ${BRAND.fontPrimary};">Special Offers</p>
                    <p style="margin: 4px 0 0 0; color: ${BRAND.textMuted}; font-size: 11px; font-family: ${BRAND.fontPrimary};">Exclusive deals for you</p>
                  </td>
                </tr>
              </table>
              
              <!-- Tagline -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top: 1px solid ${BRAND.borderColor}; padding-top: 20px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 13px; font-family: ${BRAND.fontPrimary};">
                      Get ready to <span style="color: ${BRAND.secondary};">taste the joy</span> with our curated selection of the best local restaurants!
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td>
              ${generateFooter()}
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}

/**
 * Generate Restaurant Order Notification Email
 * Sent to restaurant when a new order is placed
 */
function generateRestaurantOrderEmail(orderDetails) {
  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    foodItem,
    quantity,
    totalPrice,
    orderDate,
    notes
  } = orderDetails;

  const foodTitle = foodItem?.title || 'Food Item';
  const formattedDate = orderDate 
    ? new Date(orderDate).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
    : new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });

  // Customer Details Content
  const customerDetailsContent = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding-bottom: 12px;">
          <p style="margin: 0 0 4px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Customer Name</p>
          <p style="margin: 0; color: ${BRAND.textPrimary}; font-size: 16px; font-weight: 600; font-family: ${BRAND.fontPrimary};">${customerName}</p>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px;">
          <p style="margin: 0 0 4px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Phone Number</p>
          <p style="margin: 0; color: ${BRAND.primary}; font-size: 15px; font-weight: 600; font-family: ${BRAND.fontPrimary};">
            <a href="tel:${customerPhone}" style="color: ${BRAND.primary}; text-decoration: none;">${customerPhone}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px;">
          <p style="margin: 0 0 4px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Email</p>
          <p style="margin: 0; color: ${BRAND.textSecondary}; font-size: 14px; font-family: ${BRAND.fontPrimary};">
            <a href="mailto:${customerEmail}" style="color: ${BRAND.textSecondary}; text-decoration: none;">${customerEmail}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <p style="margin: 0 0 4px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Delivery Address</p>
          <p style="margin: 0; color: ${BRAND.textPrimary}; font-size: 14px; line-height: 1.5; font-family: ${BRAND.fontPrimary}; background: ${BRAND.bgElevated}; padding: 12px; border-radius: 8px; border-left: 3px solid ${BRAND.primary};">${deliveryAddress}</p>
        </td>
      </tr>
    </table>
  `;

  // Order Details Content
  const orderDetailsContent = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <!-- Item Row -->
      <tr>
        <td style="padding: 14px 0; border-bottom: 1px solid ${BRAND.borderColor};">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="vertical-align: top;">
                <p style="margin: 0 0 4px 0; color: ${BRAND.textPrimary}; font-size: 18px; font-weight: 700; font-family: ${BRAND.fontPrimary};">${foodTitle}</p>
              </td>
              <td style="text-align: right; vertical-align: top; width: 80px;">
                <p style="margin: 0; color: ${BRAND.secondary}; font-size: 18px; font-weight: 700; font-family: ${BRAND.fontPrimary};">x ${quantity}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Total -->
      <tr>
        <td style="padding: 14px 0 0 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="color: ${BRAND.textPrimary}; font-size: 16px; font-weight: 600; font-family: ${BRAND.fontPrimary};">Order Total</td>
              <td style="text-align: right; color: ${BRAND.success}; font-size: 20px; font-weight: 700; font-family: ${BRAND.fontPrimary};">₹${totalPrice}</td>
            </tr>
          </table>
        </td>
      </tr>
      
      ${notes ? `
      <!-- Special Notes -->
      <tr>
        <td style="padding-top: 14px; border-top: 1px solid ${BRAND.borderColor}; margin-top: 14px;">
          <p style="margin: 0 0 4px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">Special Notes</p>
          <p style="margin: 0; color: ${BRAND.warning}; font-size: 14px; font-family: ${BRAND.fontPrimary};">${notes}</p>
        </td>
      </tr>
      ` : ''}
    </table>
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>New Order - Foody</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.bgDark}; font-family: ${BRAND.fontPrimary};">
  
  <!-- Email Container -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${BRAND.bgDark};">
    <tr>
      <td align="center" style="padding: 30px 15px;">
        
        <!-- Email Wrapper -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background: ${BRAND.bgCard}; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td>
              ${generateHeader()}
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 35px 30px;">
              
              <!-- Alert Banner -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, ${BRAND.warning} 0%, #FF6B35 100%); border-radius: 12px; margin-bottom: 25px;">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 12px;">
                          <span style="font-size: 32px;">🔔</span>
                        </td>
                        <td valign="middle">
                          <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; font-family: ${BRAND.fontPrimary};">
                            NEW ORDER RECEIVED!
                          </h1>
                          <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.9); font-size: 13px; font-family: ${BRAND.fontPrimary};">
                            Please prepare and serve this order
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Order ID Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: ${BRAND.bgElevated}; border: 2px solid ${BRAND.primary}; border-radius: 12px; margin-bottom: 25px;">
                <tr>
                  <td align="center" style="padding: 22px;">
                    <p style="margin: 0 0 5px 0; color: ${BRAND.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-family: ${BRAND.fontPrimary};">Order ID</p>
                    <p style="margin: 0 0 10px 0; color: ${BRAND.primary}; font-size: 24px; font-weight: 700; letter-spacing: 1px; font-family: ${BRAND.fontPrimary};">${orderId}</p>
                    <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 12px; font-family: ${BRAND.fontPrimary};">${formattedDate}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Order Details Card -->
              ${generateInfoCard('Order Details', '📦', orderDetailsContent)}
              
              <!-- Customer Details Card -->
              ${generateInfoCard('Customer Details', '👤', customerDetailsContent)}
              
              <!-- Action Required -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: rgba(76, 175, 80, 0.1); border: 1px solid ${BRAND.success}; border-radius: 12px; margin-top: 5px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td valign="top" style="width: 40px;">
                          <span style="font-size: 24px;">✅</span>
                        </td>
                        <td valign="middle" style="padding-left: 10px;">
                          <p style="margin: 0 0 4px 0; color: ${BRAND.success}; font-size: 15px; font-weight: 600; font-family: ${BRAND.fontPrimary};">Action Required</p>
                          <p style="margin: 0; color: ${BRAND.textSecondary}; font-size: 13px; font-family: ${BRAND.fontPrimary};">
                            Please prepare this order and ensure timely delivery to the customer address mentioned above.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td>
              ${generateFooter()}
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}

// Export the Email Template Service
const EmailTemplateService = {
  generateOrderConfirmationEmail,
  generateOrderStatusEmail,
  generateWelcomeEmail,
  generateRestaurantOrderEmail,
  BRAND,
  generateHeader,
  generateFooter,
  generateInfoCard
};

export default EmailTemplateService;

export {
  generateOrderConfirmationEmail,
  generateOrderStatusEmail,
  generateWelcomeEmail,
  generateRestaurantOrderEmail,
  BRAND,
  generateHeader,
  generateFooter,
  generateInfoCard
};
