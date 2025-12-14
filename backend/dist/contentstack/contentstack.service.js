"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ContentstackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentstackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ContentstackService = ContentstackService_1 = class ContentstackService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ContentstackService_1.name);
        this.apiKey = this.configService.get('CONTENTSTACK_API_KEY');
        this.deliveryToken = this.configService.get('CONTENTSTACK_DELIVERY_TOKEN');
        this.managementToken = this.configService.get('CONTENTSTACK_MANAGEMENT_TOKEN');
        this.environment = this.configService.get('CONTENTSTACK_ENVIRONMENT') || 'development';
        const region = this.configService.get('CONTENTSTACK_REGION') || 'NA';
        this.deliveryBaseUrl = region === 'EU'
            ? 'https://eu-cdn.contentstack.com/v3'
            : 'https://cdn.contentstack.io/v3';
        this.cmaBaseUrl = region === 'EU'
            ? 'https://eu-api.contentstack.com/v3'
            : 'https://api.contentstack.io/v3';
    }
    async createRestaurant(data) {
        if (!this.managementToken) {
            this.logger.error('CONTENTSTACK_MANAGEMENT_TOKEN not configured');
            return null;
        }
        try {
            const existingRestaurant = await this.findRestaurantByName(data.title);
            if (existingRestaurant) {
                this.logger.log(`Restaurant "${data.title}" already exists with UID: ${existingRestaurant.uid}`);
                return existingRestaurant;
            }
            const response = await fetch(`${this.cmaBaseUrl}/content_types/restaurants/entries?locale=en-us`, {
                method: 'POST',
                headers: {
                    'api_key': this.apiKey,
                    'authorization': this.managementToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    entry: {
                        title: data.title,
                        email: data.email,
                        phone: data.phone || '',
                        address: data.address || '',
                        description: data.description || `Welcome to ${data.title}!`,
                        is_active: true,
                    },
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                this.logger.error(`Failed to create restaurant: ${JSON.stringify(errorData)}`);
                if (errorData?.errors?.title?.includes('is not unique.')) {
                    const existing = await this.findRestaurantByName(data.title);
                    if (existing) {
                        return existing;
                    }
                }
                return null;
            }
            const result = await response.json();
            const entry = result.entry;
            this.logger.log(`Restaurant created in Contentstack: ${entry.uid}`);
            await this.publishEntry('restaurants', entry.uid);
            return {
                uid: entry.uid,
                title: entry.title,
                email: entry.email,
                phone: entry.phone,
                address: entry.address,
            };
        }
        catch (error) {
            this.logger.error(`Error creating restaurant: ${error.message}`);
            return null;
        }
    }
    async findRestaurantByName(name) {
        try {
            const response = await fetch(`${this.deliveryBaseUrl}/content_types/restaurants/entries?query={"title":"${name}"}&environment=${this.environment}`, {
                headers: {
                    'api_key': this.apiKey,
                    'access_token': this.deliveryToken,
                },
            });
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            if (!data.entries || data.entries.length === 0) {
                return null;
            }
            const entry = data.entries[0];
            return {
                uid: entry.uid,
                title: entry.title,
                email: entry.email,
                phone: entry.phone,
                address: entry.address,
            };
        }
        catch (error) {
            this.logger.error(`Error finding restaurant by name: ${error.message}`);
            return null;
        }
    }
    async publishEntry(contentTypeUid, entryUid) {
        try {
            const response = await fetch(`${this.cmaBaseUrl}/content_types/${contentTypeUid}/entries/${entryUid}/publish`, {
                method: 'POST',
                headers: {
                    'api_key': this.apiKey,
                    'authorization': this.managementToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    entry: {
                        environments: [this.environment],
                        locales: ['en-us'],
                    },
                }),
            });
            if (!response.ok) {
                this.logger.warn(`Failed to publish entry ${entryUid}`);
                return false;
            }
            this.logger.log(`Entry ${entryUid} published to ${this.environment}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Error publishing entry: ${error.message}`);
            return false;
        }
    }
    async getRestaurantByUid(uid) {
        try {
            const response = await fetch(`${this.deliveryBaseUrl}/content_types/restaurants/entries/${uid}?environment=${this.environment}`, {
                headers: {
                    'api_key': this.apiKey,
                    'access_token': this.deliveryToken,
                },
            });
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            const entry = data.entry;
            return {
                uid: entry.uid,
                title: entry.title,
                email: entry.email,
                phone: entry.phone,
                address: entry.address,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching restaurant: ${error.message}`);
            return null;
        }
    }
    async getAllRestaurants() {
        try {
            const response = await fetch(`${this.deliveryBaseUrl}/content_types/restaurants/entries?environment=${this.environment}`, {
                headers: {
                    'api_key': this.apiKey,
                    'access_token': this.deliveryToken,
                },
            });
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            return (data.entries || []).map((entry) => ({
                uid: entry.uid,
                title: entry.title,
                email: entry.email,
                phone: entry.phone,
                address: entry.address,
            }));
        }
        catch (error) {
            this.logger.error(`Error fetching restaurants: ${error.message}`);
            return [];
        }
    }
    async getOfferByCode(code) {
        try {
            const response = await fetch(`${this.deliveryBaseUrl}/content_types/offers/entries?query={"code":"${code}","is_active":true}&environment=${this.environment}`, {
                headers: {
                    'api_key': this.apiKey,
                    'access_token': this.deliveryToken,
                },
            });
            if (!response.ok) {
                this.logger.warn(`Offer not found: ${code}`);
                return null;
            }
            const data = await response.json();
            if (!data.entries || data.entries.length === 0) {
                return null;
            }
            const entry = data.entries[0];
            const now = new Date();
            if (entry.valid_from && new Date(entry.valid_from) > now) {
                return null;
            }
            if (entry.valid_until && new Date(entry.valid_until) < now) {
                return null;
            }
            return {
                code: entry.code,
                description: entry.description,
                discountType: entry.discount_type,
                discountValue: entry.discount_value,
                minOrderValue: entry.min_order_value,
                maxDiscount: entry.max_discount,
                validFrom: entry.valid_from,
                validUntil: entry.valid_until,
                applicableCategories: entry.applicable_categories,
                applicableRestaurants: entry.applicable_restaurants,
                isActive: entry.is_active,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching offer: ${error.message}`);
            return null;
        }
    }
    async getActiveOffers() {
        try {
            const response = await fetch(`${this.deliveryBaseUrl}/content_types/offers/entries?query={"is_active":true}&environment=${this.environment}`, {
                headers: {
                    'api_key': this.apiKey,
                    'access_token': this.deliveryToken,
                },
            });
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            if (!data.entries) {
                return [];
            }
            const now = new Date();
            return data.entries
                .filter((entry) => {
                if (entry.valid_from && new Date(entry.valid_from) > now)
                    return false;
                if (entry.valid_until && new Date(entry.valid_until) < now)
                    return false;
                return true;
            })
                .map((entry) => ({
                code: entry.code,
                description: entry.description,
                discountType: entry.discount_type,
                discountValue: entry.discount_value,
                minOrderValue: entry.min_order_value,
                maxDiscount: entry.max_discount,
                applicableCategories: entry.applicable_categories,
                applicableRestaurants: entry.applicable_restaurants,
                isActive: entry.is_active,
            }));
        }
        catch (error) {
            this.logger.error(`Error fetching offers: ${error.message}`);
            return [];
        }
    }
    async getOffersByRestaurant(restaurantUid) {
        const allOffers = await this.getActiveOffers();
        return allOffers.filter(offer => !offer.applicableRestaurants ||
            offer.applicableRestaurants.length === 0 ||
            offer.applicableRestaurants.includes(restaurantUid));
    }
    async getOffersByCategory(category) {
        const allOffers = await this.getActiveOffers();
        return allOffers.filter(offer => !offer.applicableCategories ||
            offer.applicableCategories.length === 0 ||
            offer.applicableCategories.includes(category));
    }
    async getRestaurantsByCity(city) {
        try {
            const response = await fetch(`${this.deliveryBaseUrl}/content_types/restaurants/entries?query={"city":"${city}"}&environment=${this.environment}`, {
                headers: {
                    'api_key': this.apiKey,
                    'access_token': this.deliveryToken,
                },
            });
            if (!response.ok) {
                this.logger.warn(`No restaurants found for city: ${city}`);
                return [];
            }
            const data = await response.json();
            return (data.entries || []).map((entry) => ({
                uid: entry.uid,
                title: entry.title,
                email: entry.email,
                phone: entry.phone,
                address: entry.address,
                city: entry.city,
                tagLine: entry.tag_line,
                cuisineType: entry.cuisine_type,
                ratings: entry.ratings,
                deliveryAvailable: entry.delivery_available,
                logo: entry.logo,
                coverImage: entry.cover_image,
            }));
        }
        catch (error) {
            this.logger.error(`Error fetching restaurants by city: ${error.message}`);
            return [];
        }
    }
    async getOffersByCity(city) {
        try {
            const response = await fetch(`${this.deliveryBaseUrl}/content_types/offers/entries?query={"$or":[{"city":"${city}"},{"city":"All"}],"is_active":true}&environment=${this.environment}`, {
                headers: {
                    'api_key': this.apiKey,
                    'access_token': this.deliveryToken,
                },
            });
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            if (!data.entries) {
                return [];
            }
            const now = new Date();
            return data.entries
                .filter((entry) => {
                if (entry.valid_from && new Date(entry.valid_from) > now)
                    return false;
                if (entry.valid_until && new Date(entry.valid_until) < now)
                    return false;
                return true;
            })
                .map((entry) => ({
                code: entry.code,
                description: entry.description,
                discountType: entry.discount_type,
                discountValue: entry.discount_value,
                minOrderValue: entry.min_order_value,
                maxDiscount: entry.max_discount,
                city: entry.city,
                isActive: entry.is_active,
            }));
        }
        catch (error) {
            this.logger.error(`Error fetching offers by city: ${error.message}`);
            return [];
        }
    }
    async getCarouselByCity(city) {
        try {
            const response = await fetch(`${this.deliveryBaseUrl}/content_types/carousel/entries?environment=${this.environment}`, {
                headers: {
                    'api_key': this.apiKey,
                    'access_token': this.deliveryToken,
                },
            });
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            const entries = data.entries || [];
            const cityCarousel = entries.find((entry) => entry.title?.toLowerCase().includes(city.toLowerCase()));
            if (cityCarousel) {
                return cityCarousel;
            }
            const defaultCarousel = entries.find((entry) => !entry.title?.toLowerCase().includes('chennai') &&
                !entry.title?.toLowerCase().includes('coimbatore') &&
                !entry.title?.toLowerCase().includes('tuticorin')) || entries[0];
            return defaultCarousel || null;
        }
        catch (error) {
            this.logger.error(`Error fetching carousel by city: ${error.message}`);
            return null;
        }
    }
};
exports.ContentstackService = ContentstackService;
exports.ContentstackService = ContentstackService = ContentstackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ContentstackService);
//# sourceMappingURL=contentstack.service.js.map