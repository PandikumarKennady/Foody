/**
 * Contentstack Content Type: Categories
 * UID: categories
 * 
 * This model defines the structure for food categories/collections
 */

const CategoryContentType = {
  uid: 'categories',
  title: 'Categories',
  description: 'Food categories and collections for organizing dishes',
  schema: [
    {
      display_name: 'Title',
      uid: 'title',
      data_type: 'text',
      field_metadata: {
        description: 'Title of the category section',
        default_value: 'Our Collections'
      },
      mandatory: true,
      unique: false,
      multiple: false
    },
    {
      display_name: 'Description',
      uid: 'description',
      data_type: 'text',
      field_metadata: {
        description: 'Description of the category section',
        multiline: true
      },
      mandatory: false,
      multiple: false
    },
    {
      display_name: 'Category',
      uid: 'category',
      data_type: 'group',
      field_metadata: {
        description: 'Individual category items'
      },
      schema: [
        {
          display_name: 'Category Link',
          uid: 'category_link',
          data_type: 'link',
          field_metadata: {
            description: 'Link to category page'
          },
          schema: [
            {
              display_name: 'Title',
              uid: 'title',
              data_type: 'text'
            },
            {
              display_name: 'Href',
              uid: 'href',
              data_type: 'text'
            }
          ]
        },
        {
          display_name: 'Image',
          uid: 'image',
          data_type: 'file',
          field_metadata: {
            description: 'Category thumbnail image'
          }
        }
      ],
      mandatory: true,
      multiple: true
    }
  ],
  options: {
    singleton: true,
    title: 'title',
    publishable: true,
    is_page: false
  }
};

module.exports = CategoryContentType;

