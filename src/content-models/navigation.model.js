/**
 * Contentstack Content Type: Navigation Bar
 * UID: navigation_bar
 * 
 * This model defines the structure for the site navigation
 */

const NavigationContentType = {
  uid: 'navigation_bar',
  title: 'Navigation Bar',
  description: 'Main navigation menu configuration',
  schema: [
    {
      display_name: 'Logo',
      uid: 'logo',
      data_type: 'file',
      field_metadata: {
        description: 'Brand logo image'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Brand Name',
      uid: 'brand_name',
      data_type: 'text',
      field_metadata: {
        description: 'Brand/site name'
      },
      mandatory: true,
      multiple: false
    },
    {
      display_name: 'Navigation Links',
      uid: 'navigation_links',
      data_type: 'group',
      field_metadata: {
        description: 'Navigation menu items'
      },
      schema: [
        {
          display_name: 'Label',
          uid: 'label',
          data_type: 'text',
          field_metadata: {
            description: 'Link text'
          }
        },
        {
          display_name: 'URL',
          uid: 'url',
          data_type: 'text',
          field_metadata: {
            description: 'Link destination'
          }
        },
        {
          display_name: 'Icon',
          uid: 'icon',
          data_type: 'text',
          field_metadata: {
            description: 'Icon name (optional)'
          }
        },
        {
          display_name: 'Is Active',
          uid: 'is_active',
          data_type: 'boolean',
          field_metadata: {
            description: 'Whether this link is currently active'
          }
        }
      ],
      mandatory: true,
      multiple: true
    }
  ],
  options: {
    singleton: true,
    title: 'brand_name',
    publishable: true,
    is_page: false
  }
};

module.exports = NavigationContentType;

