/**
 * Contentstack Content Type: Orders
 * UID: orders
 * 
 * This model defines the structure for customer orders
 */

const OrderContentType = {
  uid: 'orders',
  title: 'Orders',
  description: 'Customer food orders and delivery information',
  schema: [
    {
      display_name: 'Order ID',
      uid: 'order_id',
      data_type: 'text',
      field_metadata: {
        description: 'Unique order identifier',
        default_value: ''
      },
      mandatory: true,
      unique: true,
      multiple: false
    },
    {
      display_name: 'Customer Name',
      uid: 'customer_name',
      data_type: 'text',
      field_metadata: {
        description: 'Name of the customer'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Email',
      uid: 'email',
      data_type: 'text',
      field_metadata: {
        description: 'Customer email address'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Phone',
      uid: 'phone',
      data_type: 'text',
      field_metadata: {
        description: 'Customer phone number'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Delivery Address',
      uid: 'delivery_address',
      data_type: 'text',
      field_metadata: {
        description: 'Delivery address',
        multiline: true
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Food Item',
      uid: 'food_item',
      data_type: 'reference',
      field_metadata: {
        description: 'Reference to the food item ordered',
        ref_multiple: false,
        ref_multiple_content_types: false
      },
      reference_to: ['foods'],
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Quantity',
      uid: 'quantity',
      data_type: 'number',
      field_metadata: {
        description: 'Number of items ordered'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Total Price',
      uid: 'total_price',
      data_type: 'number',
      field_metadata: {
        description: 'Total order amount'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Order Status',
      uid: 'order_status',
      data_type: 'text',
      field_metadata: {
        description: 'Current status of the order',
        enum: {
          advanced: false,
          choices: [
            { value: 'pending', display: 'Pending' },
            { value: 'confirmed', display: 'Confirmed' },
            { value: 'preparing', display: 'Preparing' },
            { value: 'out_for_delivery', display: 'Out for Delivery' },
            { value: 'delivered', display: 'Delivered' },
            { value: 'cancelled', display: 'Cancelled' }
          ]
        }
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Order Date',
      uid: 'order_date',
      data_type: 'isodate',
      field_metadata: {
        description: 'Date and time when order was placed'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Delivery Date',
      uid: 'delivery_date',
      data_type: 'isodate',
      field_metadata: {
        description: 'Expected delivery date and time'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Notes',
      uid: 'notes',
      data_type: 'text',
      field_metadata: {
        description: 'Additional order notes or special instructions',
        multiline: true
      },
      mandatory: false,
      multiple: false
    }
  ],
  options: {
    singleton: false,
    title: 'order_id',
    publishable: true,
    is_page: false
  }
};

module.exports = OrderContentType;

