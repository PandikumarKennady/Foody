/**
 * Content Type Models - Schema Definitions Only
 * 
 * These are TypeScript-like schema definitions for Contentstack content types.
 * Used for documentation and validation purposes only.
 * Actual data is fetched directly from Contentstack entries.
 */

/**
 * Food Content Type Schema
 */
const FoodContentType = {
  uid: 'foods',
  title: 'Foods',
  description: 'Food items available for ordering',
  schema: {
    title: { type: 'text', required: true },
    url: { type: 'text', required: true },
    dish_image: { type: 'file', required: true },
    description: { type: 'text', multiline: true, required: true },
    ingredients: { type: 'text', multiline: true },
    restaurant: { type: 'reference', reference_to: 'restaurants', required: true },
    rate: { type: 'number', required: true },
    ratings: { type: 'json' },
    avail_from: { type: 'text' },
    avail_until: { type: 'text' },
    category: { type: 'text', multiple: true }
  }
};

/**
 * Restaurant Content Type Schema
 */
const RestaurantContentType = {
  uid: 'restaurants',
  title: 'Restaurants',
  description: 'Restaurants serving food items',
  schema: {
    title: { type: 'text', required: true, unique: true },
    tag_line: { type: 'text' },
    description: { type: 'text', multiline: true, required: true },
    logo: { type: 'file', required: true },
    cover_image: { type: 'file' },
    address: { type: 'text', multiline: true, required: true },
    city: { type: 'text', required: true },
    phone: { type: 'text', required: true },
    cuisine_type: { type: 'text', multiple: true },
    opens_at: { type: 'text' },
    closes_at: { type: 'text' },
    rating: { type: 'json' },
    delivery_available: { type: 'boolean' },
    is_active: { type: 'boolean' },
    is_featured: { type: 'boolean' }
  }
};

/**
 * Category Content Type Schema
 */
const CategoryContentType = {
  uid: 'categories',
  title: 'Categories',
  description: 'Food categories for filtering',
  schema: {
    title: { type: 'text', required: true },
    url: { type: 'text' },
    category_image: { type: 'file' },
    description: { type: 'text', multiline: true }
  }
};

/**
 * Carousel Content Type Schema
 */
const CarouselContentType = {
  uid: 'carousel',
  title: 'Carousel',
  description: 'Homepage carousel/slider content',
  singleton: true,
  schema: {
    title: { type: 'text', required: true },
    slides: {
      type: 'group',
      multiple: true,
      fields: {
        image: { type: 'file', required: true },
        title: { type: 'text' },
        description: { type: 'text' },
        link: { type: 'link' }
      }
    }
  }
};

/**
 * Navigation Content Type Schema
 */
const NavigationContentType = {
  uid: 'navigation_bar',
  title: 'Navigation Bar',
  description: 'Site navigation menu',
  singleton: true,
  schema: {
    title: { type: 'text', required: true },
    logo: { type: 'file' },
    nav_items: {
      type: 'group',
      multiple: true,
      fields: {
        title: { type: 'text', required: true },
        url: { type: 'text', required: true },
        is_external: { type: 'boolean' }
      }
    }
  }
};

/**
 * Order Content Type Schema
 */
const OrderContentType = {
  uid: 'orders',
  title: 'Orders',
  description: 'Customer orders',
  schema: {
    order_id: { type: 'text', required: true, unique: true },
    customer_name: { type: 'text', required: true },
    customer_phone: { type: 'text', required: true },
    customer_address: { type: 'text', multiline: true, required: true },
    food_items: { type: 'reference', reference_to: 'foods', multiple: true },
    total_amount: { type: 'number', required: true },
    status: { type: 'text', enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'] },
    order_date: { type: 'date' },
    notes: { type: 'text', multiline: true }
  }
};

/**
 * Blog Content Type Schema
 */
const BlogContentType = {
  uid: 'blog',
  title: 'Blog',
  description: 'Blog page with customer reviews',
  singleton: true,
  schema: {
    title: { type: 'text', required: true },
    reviews: {
      type: 'group',
      multiple: true,
      fields: {
        ratings: { type: 'json' },
        reviews: { type: 'text', multiline: true, required: true },
        profile: { type: 'file', required: true },
        name: { type: 'text', required: true },
        location: { type: 'text', required: true }
      }
    }
  }
};

/**
 * Footer Content Type Schema
 */
const FoodyFooterContentType = {
  uid: 'foody_footer',
  title: 'Foody Footer',
  description: 'Site footer with links and social media',
  singleton: true,
  schema: {
    title: { type: 'text', required: true },
    fooder_classes: {
      type: 'blocks',
      multiple: true,
      blocks: ['class', 'social']
    },
    copyright_information: { type: 'text', multiline: true }
  }
};

/**
 * All content type schemas
 */
const ContentModels = {
  foods: FoodContentType,
  restaurants: RestaurantContentType,
  categories: CategoryContentType,
  carousel: CarouselContentType,
  navigation_bar: NavigationContentType,
  orders: OrderContentType,
  blog: BlogContentType,
  foody_footer: FoodyFooterContentType
};

/**
 * Get a content model by UID
 * @param {string} uid - Content type UID
 * @returns {Object|null} Content type schema
 */
function getContentModel(uid) {
  return ContentModels[uid] || null;
}

/**
 * Get all content model UIDs
 * @returns {string[]} Array of content type UIDs
 */
function getContentModelUIDs() {
  return Object.keys(ContentModels);
}

/**
 * Validate if a content type exists
 * @param {string} uid - Content type UID
 * @returns {boolean}
 */
function isValidContentType(uid) {
  return uid in ContentModels;
}

module.exports = {
  ContentModels,
  getContentModel,
  getContentModelUIDs,
  isValidContentType,
  // Individual schema exports
  FoodContentType,
  RestaurantContentType,
  CategoryContentType,
  CarouselContentType,
  NavigationContentType,
  OrderContentType,
  BlogContentType,
  FoodyFooterContentType
};
