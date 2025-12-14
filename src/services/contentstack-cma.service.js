/**
 * Contentstack CMA (Content Management API) Service
 * 
 * Handles asset uploads and entry management
 */

const CMA_BASE_URL = process.env.REACT_APP_CONTENTSTACK_CMA_HOST || 'https://api.contentstack.io';
const API_KEY = process.env.REACT_APP_CONTENTSTACK_API_KEY;
const MANAGEMENT_TOKEN = process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN;
const BRANCH = process.env.REACT_APP_CONTENTSTACK_BRANCH || 'main';

/**
 * Upload an asset to Contentstack
 * @param {File} file - The file to upload
 * @param {string} title - Asset title
 * @param {string} description - Asset description
 * @returns {Promise<Object>} - Uploaded asset data
 */
export async function uploadAsset(file, title = '', description = '') {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
        throw new Error('Contentstack API Key and Management Token are required for asset upload');
    }

    const formData = new FormData();
    formData.append('asset[upload]', file);
    formData.append('asset[title]', title || file.name);
    if (description) {
        formData.append('asset[description]', description);
    }

    try {
        const response = await fetch(`${CMA_BASE_URL}/v3/assets`, {
            method: 'POST',
            headers: {
                'api_key': API_KEY,
                'authorization': MANAGEMENT_TOKEN,
                'branch': BRANCH
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error_message || 'Failed to upload asset');
        }

        const data = await response.json();
        console.log('[CMA] Asset uploaded successfully:', data.asset.uid);
        return data.asset;
    } catch (error) {
        console.error('[CMA] Error uploading asset:', error);
        throw error;
    }
}

/**
 * Get a single entry
 * @param {string} contentTypeUid - Content type UID
 * @param {string} entryUid - Entry UID
 * @returns {Promise<Object>} - Entry data
 */
export async function getEntry(contentTypeUid, entryUid) {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
        throw new Error('Contentstack credentials are required');
    }

    try {
        const response = await fetch(
            `${CMA_BASE_URL}/v3/content_types/${contentTypeUid}/entries/${entryUid}`,
            {
                method: 'GET',
                headers: {
                    'api_key': API_KEY,
                    'authorization': MANAGEMENT_TOKEN,
                    'branch': BRANCH,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error_message || 'Failed to get entry');
        }

        const data = await response.json();
        return data.entry;
    } catch (error) {
        console.error('[CMA] Error getting entry:', error);
        throw error;
    }
}

/**
 * Update an entry
 * @param {string} contentTypeUid - Content type UID
 * @param {string} entryUid - Entry UID
 * @param {Object} entryData - Updated entry data
 * @param {string} locale - Locale code
 * @returns {Promise<Object>} - Updated entry data
 */
export async function updateEntry(contentTypeUid, entryUid, entryData, locale = 'en-us') {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
        throw new Error('Contentstack credentials are required');
    }

    try {
        const response = await fetch(
            `${CMA_BASE_URL}/v3/content_types/${contentTypeUid}/entries/${entryUid}?locale=${locale}`,
            {
                method: 'PUT',
                headers: {
                    'api_key': API_KEY,
                    'authorization': MANAGEMENT_TOKEN,
                    'branch': BRANCH,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ entry: entryData })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error_message || 'Failed to update entry');
        }

        const data = await response.json();
        console.log('[CMA] Entry updated successfully:', data.entry.uid);
        return data.entry;
    } catch (error) {
        console.error('[CMA] Error updating entry:', error);
        throw error;
    }
}

/**
 * Publish an entry
 * @param {string} contentTypeUid - Content type UID
 * @param {string} entryUid - Entry UID
 * @param {Array<string>} environments - Environment names
 * @param {Array<string>} locales - Locale codes
 * @returns {Promise<Object>}
 */
export async function publishEntry(contentTypeUid, entryUid, environments = ['development'], locales = ['en-us']) {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
        throw new Error('Contentstack credentials are required');
    }

    try {
        const response = await fetch(
            `${CMA_BASE_URL}/v3/content_types/${contentTypeUid}/entries/${entryUid}/publish`,
            {
                method: 'POST',
                headers: {
                    'api_key': API_KEY,
                    'authorization': MANAGEMENT_TOKEN,
                    'branch': BRANCH,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    entry: {
                        environments: environments,
                        locales: locales
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error_message || 'Failed to publish entry');
        }

        const data = await response.json();
        console.log('[CMA] Entry published successfully');
        return data;
    } catch (error) {
        console.error('[CMA] Error publishing entry:', error);
        throw error;
    }
}

/**
 * Sanitize a review object for CMA update
 * Converts full asset objects to just UIDs
 * @param {Object} review - Review object from entry
 * @returns {Object} - Sanitized review
 */
function sanitizeReviewForUpdate(review) {
    const sanitized = {
        ratings: review.ratings,
        reviews: review.reviews,
        name: review.name,
        location: review.location
    };

    // Convert profile asset object to just UID
    // Contentstack returns { uid, url, filename, ... } but expects just "uid" string
    if (review.profile) {
        if (typeof review.profile === 'string') {
            // Already a UID string
            sanitized.profile = review.profile;
        } else if (review.profile.uid) {
            // Full asset object - extract just the UID
            sanitized.profile = review.profile.uid;
        }
        // Skip if profile is in an invalid format
    }

    return sanitized;
}

/**
 * Add a review to the blog entry with profile image
 * @param {Object} reviewData - Review data
 * @param {File} profileImage - Profile image file
 * @returns {Promise<Object>} - Updated blog entry
 */
export async function addBlogReview(reviewData, profileImage = null) {
    const BLOG_ENTRY_UID = 'blt2842719df395067c'; // Blog entry UID
    const CONTENT_TYPE_UID = 'blog';

    try {
        let assetUid = null;

        // Step 1: Upload profile image if provided
        if (profileImage) {
            console.log('[CMA] Uploading profile image...');
            const asset = await uploadAsset(
                profileImage,
                `Review Profile - ${reviewData.name}`,
                `Profile image for review by ${reviewData.name}`
            );
            assetUid = asset.uid;
            console.log('[CMA] Profile image uploaded:', assetUid);
        }

        // Step 2: Get current blog entry
        console.log('[CMA] Fetching current blog entry...');
        const currentEntry = await getEntry(CONTENT_TYPE_UID, BLOG_ENTRY_UID);

        // Step 3: Prepare new review
        const newReview = {
            ratings: { value: reviewData.rating },
            reviews: reviewData.review,
            name: reviewData.name,
            location: reviewData.location
        };

        // Add profile image reference if uploaded
        if (assetUid) {
            newReview.profile = assetUid;
        }

        // Step 4: Sanitize existing reviews - convert asset objects to UIDs
        // This fixes the "is not a valid upload" error
        const existingReviews = (currentEntry.reviews || []).map(sanitizeReviewForUpdate);

        // Step 5: Add new review to existing reviews
        const updatedReviews = [newReview, ...existingReviews];

        // Step 6: Prepare entry data for update (only include necessary fields)
        const entryUpdateData = {
            title: currentEntry.title,
            reviews: updatedReviews
        };

        // Step 7: Update the entry
        console.log('[CMA] Updating blog entry with new review...');
        const updatedEntry = await updateEntry(CONTENT_TYPE_UID, BLOG_ENTRY_UID, entryUpdateData);

        console.log('[CMA] Review added successfully!');
        return updatedEntry;

    } catch (error) {
        console.error('[CMA] Error adding blog review:', error);
        throw error;
    }
}

/**
 * Check if CMA is configured
 * @returns {boolean}
 */
export function isCMAConfigured() {
    return !!(API_KEY && MANAGEMENT_TOKEN);
}

export default {
    uploadAsset,
    getEntry,
    updateEntry,
    publishEntry,
    addBlogReview,
    isCMAConfigured
};


