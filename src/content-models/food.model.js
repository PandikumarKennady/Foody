/**
 * Contentstack Content Type: Foods
 * UID: foods
 * 
 * This model defines the structure for food items in the Foody ordering service
 */

const FoodContentType = {
  uid: 'foods',
  title: 'Foods',
  description: 'Food items available for ordering',
  schema: [
    {
      display_name: 'Title',
      uid: 'title',
      data_type: 'text',
      field_metadata: {
        description: 'Name of the dish',
        default_value: ''
      },
      mandatory: true,
      unique: false,
      multiple: false
    },
    {
      display_name: 'URL',
      uid: 'url',
      data_type: 'text',
      field_metadata: {
        description: 'Unique URL path for the dish',
        default_value: ''
      },
      mandatory: true,
      unique: true,
      multiple: false
    },
    {
      display_name: 'Dish Image',
      uid: 'dish_image',
      data_type: 'file',
      field_metadata: {
        description: 'Image of the dish',
        rich_text_type: 'standard'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Description',
      uid: 'description',
      data_type: 'text',
      field_metadata: {
        description: 'Detailed description of the dish',
        multiline: true
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Ingredients',
      uid: 'ingredients',
      data_type: 'text',
      field_metadata: {
        description: 'Main ingredients used in the dish',
        multiline: true
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Restaurant',
      uid: 'restaurant',
      data_type: 'reference',
      field_metadata: {
        description: 'Reference to the restaurant serving this dish',
        ref_multiple: false
      },
      reference_to: ['restaurants'],
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Rate',
      uid: 'rate',
      data_type: 'number',
      field_metadata: {
        description: 'Price per unit'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Ratings',
      uid: 'ratings',
      data_type: 'group',
      field_metadata: {
        description: 'Rating information'
      },
      schema: [
        {
          display_name: 'Value',
          uid: 'value',
          data_type: 'number',
          field_metadata: {
            description: 'Rating value (out of 5)'
          }
        }
      ],
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Available From',
      uid: 'avail_from',
      data_type: 'text',
      field_metadata: {
        description: 'Start time of availability (e.g., 09:00 AM)'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Available Until',
      uid: 'avail_until',
      data_type: 'text',
      field_metadata: {
        description: 'End time of availability (e.g., 11:00 PM)'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Category',
      uid: 'category',
      data_type: 'text',
      field_metadata: {
        description: 'Categories/tags for the dish (e.g., Veg, Non-Veg, Spicy)'
      },
      mandatory: true,
      multiple: true
    },
    {
      display_name: 'Is Available',
      uid: 'is_available',
      data_type: 'boolean',
      field_metadata: {
        description: 'Whether the dish is currently available for ordering'
      },
      mandatory: false,
      multiple: false
    }
  ],
  options: {
    singleton: false,
    title: 'title',
    publishable: true,
    is_page: true,
    url_pattern: '/foods/:title',
    url_prefix: '/'
  }
};

module.exports = FoodContentType;

