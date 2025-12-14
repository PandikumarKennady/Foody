/**
 * Contentstack Content Type: Restaurants
 * UID: restaurants
 * 
 * This model defines the structure for restaurant entries in the Foody ordering service
 */

const RestaurantContentType = {
  uid: 'restaurants',
  title: 'Restaurants',
  description: 'Restaurants serving food items on the platform',
  schema: [
    {
      display_name: 'Title',
      uid: 'title',
      data_type: 'text',
      field_metadata: {
        description: 'Name of the restaurant'
      },
      mandatory: true,
      unique: true,
      multiple: false
    },
    {
      display_name: 'Tag Line',
      uid: 'tag_line',
      data_type: 'text',
      field_metadata: {
        description: 'Short tagline for the restaurant'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Description',
      uid: 'description',
      data_type: 'text',
      field_metadata: {
        description: 'Detailed description of the restaurant',
        multiline: true
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Logo',
      uid: 'logo',
      data_type: 'file',
      field_metadata: {
        description: 'Restaurant logo image'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Cover Image',
      uid: 'cover_image',
      data_type: 'file',
      field_metadata: {
        description: 'Cover/banner image for the restaurant'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Address',
      uid: 'address',
      data_type: 'text',
      field_metadata: {
        description: 'Full address of the restaurant',
        multiline: true
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'City',
      uid: 'city',
      data_type: 'text',
      field_metadata: {
        description: 'City where the restaurant is located'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Phone',
      uid: 'phone',
      data_type: 'text',
      field_metadata: {
        description: 'Contact phone number'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Cuisine Type',
      uid: 'cuisine_type',
      data_type: 'text',
      field_metadata: {
        description: 'Types of cuisine served (e.g., South Indian, Chinese, Continental)'
      },
      mandatory: false,
      multiple: true
    },
    {
      display_name: 'Opens At',
      uid: 'opens_at',
      data_type: 'text',
      field_metadata: {
        description: 'Opening time of the restaurant'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Closes At',
      uid: 'closes_at',
      data_type: 'text',
      field_metadata: {
        description: 'Closing time of the restaurant'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Rating',
      uid: 'rating',
      data_type: 'json',
      field_metadata: {
        description: 'Rating information for the restaurant'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Delivery Available',
      uid: 'delivery_available',
      data_type: 'boolean',
      field_metadata: {
        description: 'Whether the restaurant offers delivery'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Is Active',
      uid: 'is_active',
      data_type: 'boolean',
      field_metadata: {
        description: 'Whether the restaurant is currently active on the platform'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Is Featured',
      uid: 'is_featured',
      data_type: 'boolean',
      field_metadata: {
        description: 'Whether the restaurant should be featured prominently'
      },
      mandatory: false,
      multiple: false
    }
  ],
  options: {
    singleton: false,
    title: 'title',
    publishable: true,
    is_page: false
  }
};

module.exports = RestaurantContentType;

