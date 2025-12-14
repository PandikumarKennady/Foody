/**
 * Contentstack Service Layer
 * 
 * This service fetches content directly from Contentstack entries.
 * Content-models are used only for schema/type definitions.
 * 
 * Supports Contentstack Personalize variants via x-cs-variant-uid header.
 * Reference: https://www.contentstack.com/docs/developers/apis/content-delivery-api
 * 
 * NOTE: No mock data - all content comes from Contentstack CMS
 */

// Maximum entries to fetch per request
const DEFAULT_LIMIT = 100;

// Environment variables for direct API calls with variants
const {
  REACT_APP_CONTENTSTACK_API_KEY,
  REACT_APP_CONTENTSTACK_DELIVERY_TOKEN,
  REACT_APP_CONTENTSTACK_ENVIRONMENT,
  REACT_APP_CONTENTSTACK_REGION,
  REACT_APP_CONTENTSTACK_BRANCH
} = process.env;

/**
 * Get CDA base URL based on region
 */
function getCDABaseUrl() {
  const region = REACT_APP_CONTENTSTACK_REGION?.toLowerCase() || 'us';
  if (region === 'us') {
    return 'https://cdn.contentstack.io';
  }
  return `https://${region}-cdn.contentstack.com`;
}

/**
 * ContentService - Main service class for content operations
 * Fetches data directly from Contentstack entries via SDK
 */
class ContentService {
  constructor(stackInstance) {
    if (!stackInstance) {
      console.warn('[ContentService] No Stack instance provided. SDK operations will fail.');
    }
    this.stack = stackInstance;
  }

  /**
   * Get all entries from a content type
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @param {Object} params.query - Query parameters
   * @returns {Promise<Array>}
   */
  async getAllEntries({ contentTypeUid, query = {} }) {
    try {
      if (!this.stack) {
        throw new Error('Contentstack SDK not initialized. Check your .env configuration.');
      }

      console.log(`[ContentService] Fetching entries from Contentstack: ${contentTypeUid}`);
      
      const Query = this.stack.ContentType(contentTypeUid).Query();
      
      // Include referenced entries - specifically restaurant_details for foods
      if (contentTypeUid === 'foods') {
        Query.includeReference(['restaurant_details']);
      } else {
        Query.includeReference('*');
      }
      
      // Set high limit to fetch all entries
      Query.limit(query.limit || DEFAULT_LIMIT);
      
      // Apply query filters
      if (query.category) {
        Query.containedIn('category', [query.category]);
      }
      
      if (query.skip) {
        Query.skip(query.skip);
      }
      
      const result = await Query.toJSON().find();
      return result[0] || [];
    } catch (error) {
      console.error(`[ContentService] Error fetching entries for ${contentTypeUid}:`, error);
      throw error;
    }
  }

  /**
   * Get a single entry by URL
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @param {string} params.entryUrl - Entry URL
   * @returns {Promise<Object>}
   */
  async getEntryByUrl({ contentTypeUid, entryUrl }) {
    try {
      if (!this.stack) {
        throw new Error('Contentstack SDK not initialized. Check your .env configuration.');
      }

      console.log(`[ContentService] Fetching entry by URL: ${contentTypeUid} - ${entryUrl}`);
      
      const Query = this.stack.ContentType(contentTypeUid).Query();
      Query.where('url', entryUrl);
      
      // Include referenced entries - specifically restaurant_details for foods
      if (contentTypeUid === 'foods') {
        Query.includeReference(['restaurant_details']);
      } else {
        Query.includeReference('*');
      }
      
      const result = await Query.toJSON().find();
      
      if (!result[0] || result[0].length === 0) {
        throw new Error(`Entry not found with URL: ${entryUrl}`);
      }
      
      return result[0][0];
    } catch (error) {
      console.error(`[ContentService] Error fetching entry by URL:`, error);
      throw error;
    }
  }

  /**
   * Get a single entry (singleton content type like navigation, footer, etc.)
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @returns {Promise<Object>}
   */
  async getSingletonEntry({ contentTypeUid }) {
    try {
      if (!this.stack) {
        throw new Error('Contentstack SDK not initialized. Check your .env configuration.');
      }

      console.log(`[ContentService] Fetching singleton entry: ${contentTypeUid}`);
      
      const Query = this.stack.ContentType(contentTypeUid).Query();
      Query.includeReference('*');
      Query.limit(1);
      
      const result = await Query.toJSON().find();
      return result[0] && result[0][0] ? result[0][0] : null;
    } catch (error) {
      console.error(`[ContentService] Error fetching singleton entry:`, error);
      throw error;
    }
  }

  /**
   * Get entry by UID
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @param {string} params.entryUid - Entry UID
   * @returns {Promise<Object>}
   */
  async getEntryByUid({ contentTypeUid, entryUid }) {
    try {
      if (!this.stack) {
        throw new Error('Contentstack SDK not initialized. Check your .env configuration.');
      }

      console.log(`[ContentService] Fetching entry by UID: ${contentTypeUid} - ${entryUid}`);
      
      const Entry = this.stack.ContentType(contentTypeUid).Entry(entryUid);
      const result = await Entry.includeReference('*').toJSON().fetch();
      
      return result;
    } catch (error) {
      console.error(`[ContentService] Error fetching entry by UID:`, error);
      throw error;
    }
  }

  /**
   * Filter entries by field value
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @param {string} params.field - Field name
   * @param {any} params.value - Value to match
   * @returns {Promise<Array>}
   */
  async filterEntries({ contentTypeUid, field, value }) {
    try {
      if (!this.stack) {
        throw new Error('Contentstack SDK not initialized. Check your .env configuration.');
      }

      console.log(`[ContentService] Filtering entries: ${contentTypeUid} where ${field} = ${value}`);
      
      const Query = this.stack.ContentType(contentTypeUid).Query();
      
      // Include referenced entries - specifically restaurant_details for foods
      if (contentTypeUid === 'foods') {
        Query.includeReference(['restaurant_details']);
      } else {
        Query.includeReference('*');
      }
      Query.limit(DEFAULT_LIMIT);
      
      // Handle array fields (like category)
      if (Array.isArray(value)) {
        Query.containedIn(field, value);
      } else {
        Query.containedIn(field, [value]);
      }
      
      const result = await Query.toJSON().find();
      return result[0] || [];
    } catch (error) {
      console.error(`[ContentService] Error filtering entries:`, error);
      throw error;
    }
  }

  /**
   * Search entries
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @param {string} params.searchTerm - Search term
   * @returns {Promise<Array>}
   */
  async searchEntries({ contentTypeUid, searchTerm }) {
    try {
      if (!this.stack) {
        throw new Error('Contentstack SDK not initialized. Check your .env configuration.');
      }

      console.log(`[ContentService] Searching entries: ${contentTypeUid} for "${searchTerm}"`);
      
      const Query = this.stack.ContentType(contentTypeUid).Query();
      Query.includeReference('*');
      Query.limit(DEFAULT_LIMIT);
      Query.regex('title', searchTerm, 'i'); // Case-insensitive search on title
      
      const result = await Query.toJSON().find();
      return result[0] || [];
    } catch (error) {
      console.error(`[ContentService] Error searching entries:`, error);
      throw error;
    }
  }

  /**
   * Get entries filtered by city
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @param {string} params.city - City to filter by
   * @returns {Promise<Array>}
   */
  async getEntriesByCity({ contentTypeUid, city }) {
    try {
      if (!this.stack) {
        throw new Error('Contentstack SDK not initialized. Check your .env configuration.');
      }

      console.log(`[ContentService] Fetching entries by city: ${contentTypeUid} - ${city}`);
      
      const Query = this.stack.ContentType(contentTypeUid).Query();
      
      // Include referenced entries
      if (contentTypeUid === 'foods') {
        Query.includeReference(['restaurant_details']);
      } else {
        Query.includeReference('*');
      }
      
      Query.limit(DEFAULT_LIMIT);
      Query.where('city', city);
      
      const result = await Query.toJSON().find();
      return result[0] || [];
    } catch (error) {
      console.error(`[ContentService] Error fetching entries by city:`, error);
      throw error;
    }
  }

  /**
   * Get carousel entry for a specific city (for personalization)
   * Falls back to default carousel if city-specific not found
   * @param {Object} params
   * @param {string} params.city - City name
   * @returns {Promise<Object>}
   */
  async getCarouselByCity({ city }) {
    try {
      if (!this.stack) {
        throw new Error('Contentstack SDK not initialized. Check your .env configuration.');
      }

      console.log(`[ContentService] Fetching carousel for city: ${city}`);
      
      const Query = this.stack.ContentType('carousel').Query();
      Query.includeReference('*');
      Query.limit(10);
      
      const result = await Query.toJSON().find();
      const allCarousels = result[0] || [];
      
      // Find city-specific carousel (contains city name in title)
      const cityCarousel = allCarousels.find(c => 
        c.title?.toLowerCase().includes(city.toLowerCase())
      );
      
      if (cityCarousel) {
        console.log(`[ContentService] Found city-specific carousel: ${cityCarousel.title}`);
        return cityCarousel;
      }
      
      // Fallback to default carousel (first one without city in title)
      const defaultCarousel = allCarousels.find(c => 
        !c.title?.toLowerCase().includes('chennai') && 
        !c.title?.toLowerCase().includes('coimbatore') &&
        !c.title?.toLowerCase().includes('tuticorin')
      ) || allCarousels[0];
      
      console.log(`[ContentService] Using default carousel: ${defaultCarousel?.title}`);
      return defaultCarousel;
    } catch (error) {
      console.error(`[ContentService] Error fetching carousel by city:`, error);
      throw error;
    }
  }

  /**
   * Get entries with personalization variant using direct API call
   * Uses Contentstack Personalize x-cs-variant-uid header
   * Reference: https://www.contentstack.com/docs/developers/apis/content-delivery-api
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @param {string} params.variantAlias - Variant alias/UID from Personalize Edge SDK (e.g., tuticorin_city_users)
   * @param {Object} params.query - Additional query params
   * @returns {Promise<Array>}
   */
  async getEntriesWithVariant({ contentTypeUid, variantAlias, query = {} }) {
    try {
      // If no variant alias, fall back to regular SDK fetch
      if (!variantAlias) {
        console.log(`[ContentService] No variant provided, using regular fetch for ${contentTypeUid}`);
        return this.getAllEntries({ contentTypeUid, query });
      }

      // Use direct API call with x-cs-variant-uid header for personalization
      // The SDK's addParam doesn't properly support variant headers
      const baseUrl = getCDABaseUrl();
      const environment = REACT_APP_CONTENTSTACK_ENVIRONMENT;
      const branch = REACT_APP_CONTENTSTACK_BRANCH || 'main';
      
      const limit = query.limit || DEFAULT_LIMIT;
      let url = `${baseUrl}/v3/content_types/${contentTypeUid}/entries?environment=${environment}&limit=${limit}`;
      
      // Add include_reference for foods
      if (contentTypeUid === 'foods') {
        url += '&include[]=restaurant_details';
      }
      
      // Add branch if not main
      if (branch && branch !== 'main') {
        url += `&branch=${branch}`;
      }
      
      console.log(`[ContentService] Fetching ${contentTypeUid} with variant: ${variantAlias}`);
      console.log(`[ContentService] API URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'api_key': REACT_APP_CONTENTSTACK_API_KEY,
          'access_token': REACT_APP_CONTENTSTACK_DELIVERY_TOKEN,
          'x-cs-variant-uid': variantAlias,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`[ContentService] API error: ${response.status} ${response.statusText}`);
        // Fall back to regular SDK fetch on error
        return this.getAllEntries({ contentTypeUid, query });
      }
      
      const data = await response.json();
      const entries = data.entries || [];
      
      console.log(`[ContentService] Retrieved ${entries.length} entries with variant: ${variantAlias}`);
      
      return entries;
    } catch (error) {
      console.error(`[ContentService] Error fetching entries with variant:`, error);
      // Fall back to regular SDK fetch on error
      return this.getAllEntries({ contentTypeUid, query });
    }
  }

  /**
   * Get a single entry with personalization variant using direct API call
   * @param {Object} params
   * @param {string} params.contentTypeUid - Content type UID
   * @param {string} params.entryUid - Entry UID
   * @param {string} params.variantAlias - Variant alias from Personalize Edge SDK
   * @returns {Promise<Object>}
   */
  async getEntryWithVariant({ contentTypeUid, entryUid, variantAlias }) {
    try {
      // If no variant alias, fall back to regular SDK fetch
      if (!variantAlias) {
        console.log(`[ContentService] No variant provided, using regular fetch for entry ${entryUid}`);
        return this.getEntryByUid({ contentTypeUid, entryUid });
      }

      // Use direct API call with x-cs-variant-uid header for personalization
      const baseUrl = getCDABaseUrl();
      const environment = REACT_APP_CONTENTSTACK_ENVIRONMENT;
      const branch = REACT_APP_CONTENTSTACK_BRANCH || 'main';
      
      let url = `${baseUrl}/v3/content_types/${contentTypeUid}/entries/${entryUid}?environment=${environment}`;
      
      // Add branch if not main
      if (branch && branch !== 'main') {
        url += `&branch=${branch}`;
      }
      
      console.log(`[ContentService] Fetching entry ${entryUid} with variant: ${variantAlias}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'api_key': REACT_APP_CONTENTSTACK_API_KEY,
          'access_token': REACT_APP_CONTENTSTACK_DELIVERY_TOKEN,
          'x-cs-variant-uid': variantAlias,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`[ContentService] API error: ${response.status} ${response.statusText}`);
        // Fall back to regular SDK fetch on error
        return this.getEntryByUid({ contentTypeUid, entryUid });
      }
      
      const data = await response.json();
      return data.entry || null;
    } catch (error) {
      console.error(`[ContentService] Error fetching entry with variant:`, error);
      // Fall back to regular SDK fetch on error
      return this.getEntryByUid({ contentTypeUid, entryUid });
    }
  }

}

/**
 * Create a singleton instance
 */
let contentServiceInstance = null;

/**
 * Initialize the content service with a Contentstack Stack instance
 * @param {Object} stackInstance - Contentstack Stack instance
 * @returns {ContentService}
 */
function initializeContentService(stackInstance) {
  if (!contentServiceInstance) {
    contentServiceInstance = new ContentService(stackInstance);
  }
  return contentServiceInstance;
}

/**
 * Get the content service instance
 * @returns {ContentService}
 */
function getContentService() {
  return contentServiceInstance;
}

module.exports = {
  ContentService,
  initializeContentService,
  getContentService
};
