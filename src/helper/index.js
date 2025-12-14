/**
 * Helper Functions for Contentstack Integration
 * 
 * Enhanced with new service layer architecture
 */

import { initializeContentService } from '../services';
import { initializeContentStackSdk } from '../sdk/utils';

// Initialize content service with SDK stack
const Stack = initializeContentStackSdk();
const contentService = initializeContentService(Stack);

/**
 * Get navigation bar data
 * @returns {Promise<Object>}
 */
export const getNavBarRes = async () => {
  try {
    const response = await contentService.getSingletonEntry({
      contentTypeUid: 'navigation_bar'
    });
    return response;
  } catch (error) {
    console.error('[Helper] Error fetching navigation:', error);
    throw error;
  }
};

/**
 * Get carousel data
 * @returns {Promise<Object>}
 */
export const getCarouselRes = async () => {
  try {
    const response = await contentService.getSingletonEntry({
      contentTypeUid: 'carousel'
    });
    return response;
  } catch (error) {
    console.error('[Helper] Error fetching carousel:', error);
    throw error;
  }
};

/**
 * Get generic content type data (singleton)
 * @param {string} uid - Content type UID
 * @returns {Promise<Object>}
 */
export const getResponse = async (uid) => {
  try {
    const response = await contentService.getSingletonEntry({
      contentTypeUid: uid
    });
    return response;
  } catch (error) {
    console.error(`[Helper] Error fetching ${uid}:`, error);
    throw error;
  }
};

/**
 * Get all food items
 * @param {Object} filters - Optional filters
 * @param {string} filters.category - Category to filter by
 * @param {number} filters.limit - Number of items to fetch
 * @param {number} filters.skip - Number of items to skip
 * @returns {Promise<Array>}
 */
export const getFoodResponse = async (filters = {}) => {
  try {
    const response = await contentService.getAllEntries({
      contentTypeUid: 'foods',
      query: filters
    });
    return response;
  } catch (error) {
    console.error('[Helper] Error fetching foods:', error);
    throw error;
  }
};

/**
 * Get paginated food items
 * @param {Object} options - Pagination options
 * @param {number} options.limit - Number of items per page (default 15)
 * @param {number} options.skip - Number of items to skip
 * @param {string} options.category - Optional category filter
 * @returns {Promise<{entries: Array, hasMore: boolean, total: number}>}
 */
export const getFoodsPaginated = async ({ limit = 15, skip = 0, category = null }) => {
  try {
    const response = await contentService.getAllEntries({
      contentTypeUid: 'foods',
      query: { 
        limit: limit + 1, // Fetch one extra to check if there's more
        skip,
        ...(category && { category })
      }
    });
    
    const hasMore = response.length > limit;
    const entries = hasMore ? response.slice(0, limit) : response;
    
    return {
      entries,
      hasMore,
      total: skip + entries.length + (hasMore ? 1 : 0)
    };
  } catch (error) {
    console.error('[Helper] Error fetching paginated foods:', error);
    throw error;
  }
};

/**
 * Get a single food item by URL
 * @param {string} url - Food item URL path (e.g., "chicken-satay" or "/chicken-satay")
 * @returns {Promise<Object>}
 */
export const getCardDishResponse = async (url) => {
  try {
    // The URL in Contentstack entries is stored as "/dish-name" format
    // Remove "/foods" prefix if present, then ensure it starts with "/"
    let entryUrl = url;
    if (url.startsWith('/foods/')) {
      entryUrl = url.replace('/foods', '');
    } else if (!url.startsWith('/')) {
      entryUrl = `/${url}`;
    }
    
    console.log('[Helper] Looking for dish with URL:', entryUrl);
    
    const response = await contentService.getEntryByUrl({
      contentTypeUid: 'foods',
      entryUrl: entryUrl
    });
    return response;
  } catch (error) {
    console.error('[Helper] Error fetching dish:', error);
    throw error;
  }
};

/**
 * Get foods by category
 * @param {string} category - Category name
 * @returns {Promise<Array>}
 */
export const getFoodsByCategory = async (category) => {
  try {
    const response = await contentService.filterEntries({
      contentTypeUid: 'foods',
      field: 'category',
      value: category
    });
    return response;
  } catch (error) {
    console.error('[Helper] Error fetching foods by category:', error);
    throw error;
  }
};

/**
 * Get all orders (if needed for admin dashboard)
 * @returns {Promise<Array>}
 */
export const getOrders = async () => {
  try {
    const response = await contentService.getAllEntries({
      contentTypeUid: 'orders'
    });
    return response;
  } catch (error) {
    console.error('[Helper] Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get all restaurants
 * @returns {Promise<Array>}
 */
export const getRestaurants = async () => {
  try {
    const response = await contentService.getAllEntries({
      contentTypeUid: 'restaurants',
      query: { limit: 100 }
    });
    return response;
  } catch (error) {
    console.error('[Helper] Error fetching restaurants:', error);
    throw error;
  }
};

/**
 * Get content service instance for advanced operations
 * @returns {ContentService}
 */
export const getContentServiceInstance = () => {
  return contentService;
};

/**
 * Get all carousel slide items
 * @returns {Promise<Array>}
 */
export const getCarouselItems = async () => {
  try {
    const response = await contentService.getAllEntries({
      contentTypeUid: 'carousel_items',
      query: { limit: 20 }
    });
    return response;
  } catch (error) {
    console.error('[Helper] Error fetching carousel items:', error);
    throw error;
  }
};

/**
 * Get carousel items filtered by city
 * @param {string} city - City name (Chennai, Coimbatore, Tuticorin)
 * @returns {Promise<Array>}
 */
export const getCarouselItemsByCity = async (city) => {
  try {
    const allItems = await getCarouselItems();
    
    // Filter items by city prefix in title
    const cityItems = allItems.filter(item => 
      item.title && item.title.toLowerCase().startsWith(city.toLowerCase())
    );
    
    // If no city-specific items found, return generic items (without city prefix)
    if (cityItems.length === 0) {
      return allItems.filter(item => 
        !item.title.includes(' - ') || 
        !['Chennai', 'Coimbatore', 'Tuticorin'].some(c => item.title.startsWith(c))
      );
    }
    
    return cityItems;
  } catch (error) {
    console.error(`[Helper] Error fetching carousel items for ${city}:`, error);
    throw error;
  }
};

/**
 * Get carousel items with personalization variant
 * Uses Contentstack Personalize entry variants
 * @param {string} variantAlias - Variant alias (e.g., chennai_users, coimbatore_users)
 * @returns {Promise<Array>}
 */
export const getCarouselItemsWithVariant = async (variantAlias) => {
  try {
    const response = await contentService.getEntriesWithVariant({
      contentTypeUid: 'carousel_items',
      variantAlias: variantAlias,
      query: { limit: 20 }
    });
    return response;
  } catch (error) {
    console.error(`[Helper] Error fetching carousel items with variant ${variantAlias}:`, error);
    return await getCarouselItems();
  }
};

/**
 * Get personalized carousel items
 * First tries variant-based fetch, then falls back to city prefix filtering
 * @param {string} city - User's city
 * @param {string} variantAlias - Variant alias from Personalize SDK
 * @returns {Promise<Array>}
 */
export const getPersonalizedCarouselItems = async (city, variantAlias) => {
  try {
    // Try fetching with variant first (for Personalize integration)
    if (variantAlias) {
      const variantItems = await getCarouselItemsWithVariant(variantAlias);
      // Check if we got variant-specific content (different from base)
      if (variantItems && variantItems.length > 0) {
        console.log(`[Helper] Using variant: ${variantAlias}`);
        return variantItems;
      }
    }
    
    // Fallback to city-prefix filtering
    console.log(`[Helper] Falling back to city filter: ${city}`);
    return await getCarouselItemsByCity(city);
  } catch (error) {
    console.error(`[Helper] Error fetching personalized carousel:`, error);
    return await getCarouselItems();
  }
};

/**
 * Get restaurants by city
 * @param {string} city - City name (e.g., "Chennai", "Coimbatore")
 * @returns {Promise<Array>}
 */
export const getRestaurantsByCity = async (city) => {
  try {
    const response = await contentService.getEntriesByCity({
      contentTypeUid: 'restaurants',
      city
    });
    return response;
  } catch (error) {
    console.error(`[Helper] Error fetching restaurants for ${city}:`, error);
    throw error;
  }
};

/**
 * Get carousel for a specific city (personalized)
 * @param {string} city - City name
 * @returns {Promise<Object>}
 */
export const getCarouselByCity = async (city) => {
  try {
    const response = await contentService.getCarouselByCity({ city });
    return response;
  } catch (error) {
    console.error(`[Helper] Error fetching carousel for ${city}:`, error);
    throw error;
  }
};

/**
 * Get foods with city filter (via restaurant reference)
 * @param {string} city - City name
 * @returns {Promise<Array>}
 */
export const getFoodsByCity = async (city) => {
  try {
    // First get restaurants by city
    const cityRestaurants = await getRestaurantsByCity(city);
    const restaurantUids = cityRestaurants.map(r => r.uid);
    
    // Get all foods
    const allFoods = await contentService.getAllEntries({
      contentTypeUid: 'foods',
      query: { limit: 100 }
    });
    
    // Filter foods that belong to city restaurants
    const cityFoods = allFoods.filter(food => {
      const restaurantRef = food.restaurant_details?.[0];
      return restaurantRef && restaurantUids.includes(restaurantRef.uid);
    });
    
    return cityFoods;
  } catch (error) {
    console.error(`[Helper] Error fetching foods for ${city}:`, error);
    throw error;
  }
};
