/**
 * Contentstack Personalize Service
 * 
 * Integrates with Contentstack Personalize Edge SDK for city-based personalization.
 * Reference: https://www.contentstack.com/docs/developers/sdks/personalize-edge-sdk/javascript
 */

import Personalize from '@contentstack/personalize-edge-sdk';

// Personalize configuration
const PERSONALIZE_PROJECT_UID = process.env.REACT_APP_PERSONALIZE_PROJECT_UID || '693e81e2da8126a46431919b';
const PERSONALIZE_EDGE_API_URL = process.env.REACT_APP_PERSONALIZE_EDGE_API_URL || 'https://personalize-edge.contentstack.com';

// Supported cities
const SUPPORTED_CITIES = ['Chennai', 'Coimbatore', 'Tuticorin'];
const DEFAULT_CITY = 'Chennai';

// City code shortcuts for URL query params (just for mapping short codes to full names)
// Variant aliases come from Personalize Edge SDK, NOT hardcoded here
const CITY_CODE_MAP = {
  'tuticorin': 'Tuticorin',
  'tuty': 'Tuticorin',
  'chennai': 'Chennai',
  'coimbatore': 'Coimbatore',
  'cbe': 'Coimbatore',
  'covai': 'Coimbatore'
};

// User state
let userCity = null;
let variantAlias = null;
let isInitialized = false;
let activeVariants = [];
let isQueryParamBased = false;
let sdkInitialized = false;
let personalizeSdk = null; // SDK instance (v1.0.9+ uses instance-based approach)

/**
 * Initialize the Personalize Edge SDK
 * Returns the SDK instance for method calls
 */
async function initializeEdgeSDK() {
  if (sdkInitialized && personalizeSdk) return personalizeSdk;
  
  if (!PERSONALIZE_PROJECT_UID) {
    console.warn('[Personalize] ⚠️ REACT_APP_PERSONALIZE_PROJECT_UID not configured in .env');
    console.warn('[Personalize] SDK will not be initialized - variants will be empty');
    return null;
  }

  try {
    console.log(`[Personalize] Initializing SDK with Project UID: ${PERSONALIZE_PROJECT_UID}`);
    console.log(`[Personalize] Edge API URL: ${PERSONALIZE_EDGE_API_URL}`);
    
    // SDK v1.0.9+ returns an instance from init()
    personalizeSdk = await Personalize.init(PERSONALIZE_PROJECT_UID, {
      edgeApiUrl: PERSONALIZE_EDGE_API_URL
    });
    sdkInitialized = true;
    console.log('[Personalize] ✅ Edge SDK initialized successfully');
    console.log('[Personalize] SDK instance methods:', personalizeSdk ? Object.keys(personalizeSdk) : 'none');
    return personalizeSdk;
  } catch (error) {
    console.error('[Personalize] ❌ Failed to initialize Edge SDK:', error);
    return null;
  }
}

/**
 * Get city from URL query parameter
 * Supports: ?city=tuticorin, ?city=tuty, ?city=chennai, etc.
 * Returns the raw query param value for SDK and mapped display name for UI
 */
function getCityFromQueryParam() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    
    if (cityParam) {
      const rawCityValue = cityParam.toLowerCase().trim();
      
      // Get display name for UI (optional mapping for nice display)
      const displayCity = CITY_CODE_MAP[rawCityValue] || 
        (SUPPORTED_CITIES.find(c => c.toLowerCase() === rawCityValue)) ||
        cityParam; // Use original param if no mapping found
      
      console.log(`[Personalize] City from URL query param - Raw: "${rawCityValue}", Display: "${displayCity}"`);
      
      // Return both raw value (for SDK) and display name (for UI)
      return { 
        rawCity: rawCityValue,  // Pass directly to Edge SDK
        displayCity: displayCity // For UI display
      };
    }
  } catch (error) {
    console.warn('[Personalize] Error reading query param:', error);
  }
  
  return null;
}

/**
 * Set User Attributes via Personalize Edge SDK
 * This triggers audience evaluation and returns active variants
 * Uses SDK v1.0.9+ instance-based approach with set() method
 */
async function setUserAttributesOnEdge(attributes) {
  let sdk = personalizeSdk;
  
  if (!sdkInitialized || !sdk) {
    sdk = await initializeEdgeSDK();
    if (!sdk) {
      console.warn('[Personalize] ⚠️ SDK not initialized, skipping attribute setting');
      return null;
    }
  }

  try {
    // Set attributes using the Edge SDK instance (v1.0.9+ uses set() method)
    console.log('[Personalize] Setting user attributes:', attributes);
    
    // SDK v1.0.9+ uses set() instead of setAttributes()
    if (typeof sdk.set === 'function') {
      await sdk.set(attributes);
      console.log('[Personalize] ✅ User attributes set successfully via sdk.set()');
    } else if (typeof sdk.setAttributes === 'function') {
      // Fallback for older SDK versions
      await sdk.setAttributes(attributes);
      console.log('[Personalize] ✅ User attributes set successfully via sdk.setAttributes()');
    } else {
      console.warn('[Personalize] ⚠️ SDK does not have set() or setAttributes() method');
      console.log('[Personalize] Available SDK methods:', Object.keys(sdk));
      return null;
    }
    
    // Log what the SDK evaluates after setting attributes
    const aliases = getActiveVariantAliases();
    console.log('[Personalize] Variant aliases after setting attributes:', aliases);
    
    return true;
  } catch (error) {
    console.warn('[Personalize] ❌ Failed to set user attributes:', error.message);
    return null;
  }
}

/**
 * Get active variant aliases from the Edge SDK
 * These aliases can be used with x-cs-variant-uid header for CDA requests
 * Uses SDK v1.0.9+ instance-based approach
 */
function getActiveVariantAliases() {
  if (!sdkInitialized || !personalizeSdk) {
    console.warn('[Personalize] ⚠️ SDK not initialized, returning empty variants');
    console.warn('[Personalize] Make sure REACT_APP_PERSONALIZE_PROJECT_UID is set in .env');
    return {};
  }

  try {
    // SDK v1.0.9+ uses instance method getVariantAliases()
    let aliases = {};
    
    if (typeof personalizeSdk.getVariantAliases === 'function') {
      aliases = personalizeSdk.getVariantAliases();
    } else if (typeof personalizeSdk.variantAliases === 'function') {
      aliases = personalizeSdk.variantAliases();
    } else {
      console.warn('[Personalize] ⚠️ SDK does not have getVariantAliases() method');
      console.log('[Personalize] Available SDK methods:', Object.keys(personalizeSdk));
      return {};
    }
    
    const aliasCount = Object.keys(aliases).length;
    
    if (aliasCount > 0) {
      console.log('[Personalize] ✅ Active variant aliases:', aliases);
    } else {
      console.warn('[Personalize] ⚠️ No variant aliases returned from SDK');
      console.warn('[Personalize] This means either:');
      console.warn('[Personalize]   1. No experiences are configured in Personalize');
      console.warn('[Personalize]   2. User does not match any audience criteria');
      console.warn('[Personalize]   3. Experiences are not published/active');
    }
    
    return aliases;
  } catch (error) {
    console.warn('[Personalize] ❌ Failed to get variant aliases:', error.message);
    return {};
  }
}

/**
 * Get variant alias string for CDA header (comma-separated)
 * This is used with the x-cs-variant-uid header
 */
function getVariantAliasString() {
  const aliases = getActiveVariantAliases();
  
  // Convert the aliases object to a comma-separated string
  // Format: { "experience_uid": "variant_alias" } -> "variant_alias1,variant_alias2"
  const aliasValues = Object.values(aliases);
  
  if (aliasValues.length > 0) {
    return aliasValues.join(',');
  }
  
  // Fallback to the stored variant alias
  return variantAlias || '';
}

/**
 * Track Impression Event via Edge SDK
 * Uses SDK v1.0.9+ instance-based approach
 */
async function trackImpression(experienceShortUid, variantShortUid) {
  if (!sdkInitialized || !personalizeSdk) {
    console.warn('[Personalize] SDK not initialized, skipping impression tracking');
    return;
  }

  try {
    // Trigger impressions for the active variants
    const aliases = getActiveVariantAliases();
    if (Object.keys(aliases).length > 0) {
      if (typeof personalizeSdk.triggerImpression === 'function') {
        await personalizeSdk.triggerImpression(experienceShortUid);
        console.log(`[Personalize] Impression tracked for ${experienceShortUid}`);
      } else {
        console.warn('[Personalize] SDK does not have triggerImpression() method');
      }
    }
  } catch (error) {
    console.warn('[Personalize] Failed to track impression:', error.message);
  }
}

/**
 * Detect user's city using IP geolocation
 */
async function detectUserCity() {
  try {
    const response = await fetch('https://ipapi.co/json/', { timeout: 5000 });
    if (response.ok) {
      const data = await response.json();
      const detectedCity = data.city;
      
      const matchedCity = SUPPORTED_CITIES.find(
        city => city.toLowerCase() === detectedCity?.toLowerCase()
      );
      
      if (matchedCity) {
        console.log(`[Personalize] Detected city via IP: ${matchedCity}`);
        return matchedCity;
      }
    }
  } catch (error) {
    console.warn('[Personalize] IP geolocation failed:', error.message);
  }
  
  // Check localStorage for saved preference
  const savedCity = localStorage.getItem('foody_user_city');
  if (savedCity && SUPPORTED_CITIES.includes(savedCity)) {
    return savedCity;
  }
  
  return DEFAULT_CITY;
}

/**
 * Initialize Personalize service
 * Priority: 1. URL query param (?city=tuticorin) 2. Edge SDK variants 3. IP geolocation 4. default
 * Variant aliases come ONLY from Personalize Edge SDK - no hardcoding
 * 
 * For URL query params, the RAW value is passed directly to the Edge SDK (e.g., "tuty", "chennai")
 */
export async function initializePersonalize() {
  // Initialize the Edge SDK first
  await initializeEdgeSDK();

  // Always check URL query param first (for experience-based personalization)
  const queryResult = getCityFromQueryParam();
  if (queryResult) {
    const { rawCity, displayCity } = queryResult;
    
    userCity = displayCity; // For UI display
    isQueryParamBased = true;
    isInitialized = true;
    
    // Pass the RAW query param value directly to Edge SDK - no mapping!
    // This allows the SDK to match audiences configured with any city value
    console.log(`[Personalize] Setting SDK attribute with RAW city value: "${rawCity}"`);
    await setUserAttributesOnEdge({ city: rawCity });
    
    // Get variant aliases from Edge SDK (NOT hardcoded)
    const sdkAliases = getActiveVariantAliases();
    variantAlias = Object.values(sdkAliases).join(',') || '';
    
    console.log(`[Personalize] Initialized from URL - Raw: "${rawCity}", Display: "${displayCity}", Variant from SDK: ${variantAlias || '(none)'}`);
    return { city: displayCity, rawCity, variantAlias, fromQueryParam: true, sdkAliases };
  }
  
  if (isInitialized && !isQueryParamBased) {
    return { city: userCity, variantAlias, activeVariants };
  }
  
  try {
    // Detect user city
    userCity = await detectUserCity();
    localStorage.setItem('foody_user_city', userCity);
    
    // Set user attributes on Edge SDK - this triggers audience evaluation
    // For non-query param cases, use lowercase city name
    await setUserAttributesOnEdge({ city: userCity.toLowerCase() });
    
    // Get active variant aliases from Edge SDK (NOT hardcoded)
    const sdkAliases = getActiveVariantAliases();
    activeVariants = Object.entries(sdkAliases).map(([expUid, varUid]) => ({
      experienceUid: expUid,
      variantUid: varUid
    }));
    
    // Use ONLY SDK variant aliases - no fallback to hardcoded values
    variantAlias = Object.values(sdkAliases).join(',') || '';
    
    isInitialized = true;
    isQueryParamBased = false;
    
    console.log(`[Personalize] Initialized - City: ${userCity}, Variant from SDK: ${variantAlias || '(none)'}`);
    
    return { city: userCity, variantAlias, activeVariants, sdkAliases };
  } catch (error) {
    console.error('[Personalize] Initialization failed:', error);
    userCity = DEFAULT_CITY;
    variantAlias = ''; // No fallback - SDK provides variants
    isInitialized = true;
    return { city: userCity, variantAlias };
  }
}

/**
 * Get the current user's city
 */
export function getUserCity() {
  return userCity || localStorage.getItem('foody_user_city') || DEFAULT_CITY;
}

/**
 * Set user's city manually (for city selector)
 * Variant aliases come from Edge SDK after setting city attribute
 */
export async function setUserCity(city) {
  if (SUPPORTED_CITIES.includes(city)) {
    userCity = city;
    isQueryParamBased = false;
    localStorage.setItem('foody_user_city', city);
    
    // Update Edge SDK with new city attribute - triggers audience re-evaluation
    await setUserAttributesOnEdge({ city: city.toLowerCase() });
    
    // Get updated variant aliases from Edge SDK (NOT hardcoded)
    const sdkAliases = getActiveVariantAliases();
    variantAlias = Object.values(sdkAliases).join(',') || '';
    
    console.log(`[Personalize] City changed to: ${city}, Variant from SDK: ${variantAlias || '(none)'}`);
    return true;
  }
  console.warn(`[Personalize] Invalid city: ${city}`);
  return false;
}

/**
 * Get the variant alias for current user
 * Returns comma-separated string for x-cs-variant-uid header
 * All variant aliases come from Edge SDK - no hardcoded fallbacks
 */
export function getVariantAlias() {
  // Get from SDK first
  const sdkVariantString = getVariantAliasString();
  if (sdkVariantString) {
    return sdkVariantString;
  }
  
  // Return stored variant alias (from SDK) or empty string
  return variantAlias || '';
}

/**
 * Check if personalization is driven by URL query param
 */
export function isFromQueryParam() {
  return isQueryParamBased;
}

/**
 * Get all active variants from SDK
 */
export function getActiveVariants() {
  return [...activeVariants];
}

/**
 * Get all supported cities
 */
export function getSupportedCities() {
  return [...SUPPORTED_CITIES];
}

/**
 * Get city code map (for URL shortcuts only, not variant aliases)
 */
export function getCityCodeMap() {
  return { ...CITY_CODE_MAP };
}

/**
 * Check if personalize is properly configured
 */
export function isPersonalizeConfigured() {
  return !!PERSONALIZE_PROJECT_UID;
}

/**
 * Check if SDK is initialized
 */
export function isSDKInitialized() {
  return sdkInitialized;
}

/**
 * Track impression for an experience
 */
export { trackImpression };

/**
 * Set user attributes
 */
export async function setUserAttributes(attributes) {
  const currentAttributes = JSON.parse(localStorage.getItem('foody_user_attributes') || '{}');
  const updatedAttributes = { ...currentAttributes, ...attributes, city: userCity };
  localStorage.setItem('foody_user_attributes', JSON.stringify(updatedAttributes));
  
  // Also update on Edge SDK
  await setUserAttributesOnEdge(updatedAttributes);
  
  return updatedAttributes;
}

/**
 * Get user attributes
 */
export function getUserAttributes() {
  return JSON.parse(localStorage.getItem('foody_user_attributes') || '{}');
}

/**
 * Clear personalization data (for logout)
 * Uses SDK v1.0.9+ instance-based approach
 */
export function clearPersonalizationData() {
  localStorage.removeItem('foody_user_city');
  localStorage.removeItem('foody_user_attributes');
  userCity = null;
  variantAlias = null;
  activeVariants = [];
  isInitialized = false;
  isQueryParamBased = false;
  
  // Reset the SDK if needed
  if (sdkInitialized && personalizeSdk) {
    try {
      if (typeof personalizeSdk.reset === 'function') {
        personalizeSdk.reset();
      }
    } catch (e) {
      // Ignore reset errors
    }
  }
  
  console.log('[Personalize] Data cleared');
}

/**
 * Get raw variant aliases object from SDK
 * Useful for debugging and advanced use cases
 */
export function getRawVariantAliases() {
  return getActiveVariantAliases();
}

// Export default object
export default {
  initializePersonalize,
  getUserCity,
  setUserCity,
  getVariantAlias,
  getSupportedCities,
  isPersonalizeConfigured,
  isSDKInitialized,
  setUserAttributes,
  getUserAttributes,
  clearPersonalizationData,
  isFromQueryParam,
  getActiveVariants,
  getCityCodeMap,
  trackImpression,
  getRawVariantAliases,
};
