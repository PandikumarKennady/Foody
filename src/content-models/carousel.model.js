/**
 * Contentstack Content Type: Carousel
 * UID: carousel
 * 
 * This model defines the structure for the homepage carousel/hero section
 */

const CarouselContentType = {
  uid: 'carousel',
  title: 'Carousel',
  description: 'Hero carousel banners for the homepage',
  schema: [
    {
      display_name: 'Title',
      uid: 'title',
      data_type: 'text',
      field_metadata: {
        description: 'Main heading for the carousel',
        default_value: ''
      },
      mandatory: true,
      unique: false,
      multiple: false
    },
    {
      display_name: 'Subtitle',
      uid: 'subtitle',
      data_type: 'text',
      field_metadata: {
        description: 'Subtitle or tagline',
        multiline: true
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Banner Images',
      uid: 'banner_images',
      data_type: 'file',
      field_metadata: {
        description: 'Carousel banner images',
        rich_text_type: 'standard'
      },
      mandatory: true,
      multiple: true
    },
    {
      display_name: 'CTA Button',
      uid: 'cta_button',
      data_type: 'group',
      field_metadata: {
        description: 'Call-to-action button configuration'
      },
      schema: [
        {
          display_name: 'Text',
          uid: 'text',
          data_type: 'text',
          field_metadata: {
            description: 'Button text'
          }
        },
        {
          display_name: 'Link',
          uid: 'link',
          data_type: 'text',
          field_metadata: {
            description: 'Button link URL'
          }
        }
      ],
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Auto Play',
      uid: 'auto_play',
      data_type: 'boolean',
      field_metadata: {
        description: 'Enable auto-play for carousel'
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Interval (seconds)',
      uid: 'interval',
      data_type: 'number',
      field_metadata: {
        description: 'Auto-play interval in seconds'
      },
      mandatory: false,
      multiple: false
    }
  ],
  options: {
    singleton: true,
    title: 'title',
    publishable: true,
    is_page: false
  }
};

module.exports = CarouselContentType;

