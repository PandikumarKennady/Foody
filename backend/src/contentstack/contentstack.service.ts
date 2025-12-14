import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Offer {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom?: Date;
  validUntil?: Date;
  applicableCategories?: string[];
  applicableRestaurants?: string[];
  isActive: boolean;
}

export interface CreateRestaurantDto {
  title: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface Restaurant {
  uid: string;
  title: string;
  email: string;
  phone?: string;
  address?: string;
}

@Injectable()
export class ContentstackService {
  private readonly logger = new Logger(ContentstackService.name);
  private readonly apiKey: string;
  private readonly deliveryToken: string;
  private readonly managementToken: string;
  private readonly environment: string;
  private readonly deliveryBaseUrl: string;
  private readonly cmaBaseUrl: string;

  constructor(private configService: ConfigService) {
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

  // ============================================
  // RESTAURANT MANAGEMENT (CMA)
  // ============================================

  async createRestaurant(data: CreateRestaurantDto): Promise<Restaurant | null> {
    if (!this.managementToken) {
      this.logger.error('CONTENTSTACK_MANAGEMENT_TOKEN not configured');
      return null;
    }

    try {
      // First, check if a restaurant with this name already exists
      const existingRestaurant = await this.findRestaurantByName(data.title);
      if (existingRestaurant) {
        this.logger.log(`Restaurant "${data.title}" already exists with UID: ${existingRestaurant.uid}`);
        return existingRestaurant;
      }

      const response = await fetch(
        `${this.cmaBaseUrl}/content_types/restaurants/entries?locale=en-us`,
        {
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
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error(`Failed to create restaurant: ${JSON.stringify(errorData)}`);
        
        // If title not unique, try to find existing restaurant
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

      // Publish the entry to the environment
      await this.publishEntry('restaurants', entry.uid);

      return {
        uid: entry.uid,
        title: entry.title,
        email: entry.email,
        phone: entry.phone,
        address: entry.address,
      };
    } catch (error) {
      this.logger.error(`Error creating restaurant: ${error.message}`);
      return null;
    }
  }

  async findRestaurantByName(name: string): Promise<Restaurant | null> {
    try {
      const response = await fetch(
        `${this.deliveryBaseUrl}/content_types/restaurants/entries?query={"title":"${name}"}&environment=${this.environment}`,
        {
          headers: {
            'api_key': this.apiKey,
            'access_token': this.deliveryToken,
          },
        }
      );

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
    } catch (error) {
      this.logger.error(`Error finding restaurant by name: ${error.message}`);
      return null;
    }
  }

  async publishEntry(contentTypeUid: string, entryUid: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.cmaBaseUrl}/content_types/${contentTypeUid}/entries/${entryUid}/publish`,
        {
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
        }
      );

      if (!response.ok) {
        this.logger.warn(`Failed to publish entry ${entryUid}`);
        return false;
      }

      this.logger.log(`Entry ${entryUid} published to ${this.environment}`);
      return true;
    } catch (error) {
      this.logger.error(`Error publishing entry: ${error.message}`);
      return false;
    }
  }

  async getRestaurantByUid(uid: string): Promise<Restaurant | null> {
    try {
      const response = await fetch(
        `${this.deliveryBaseUrl}/content_types/restaurants/entries/${uid}?environment=${this.environment}`,
        {
          headers: {
            'api_key': this.apiKey,
            'access_token': this.deliveryToken,
          },
        }
      );

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
    } catch (error) {
      this.logger.error(`Error fetching restaurant: ${error.message}`);
      return null;
    }
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      const response = await fetch(
        `${this.deliveryBaseUrl}/content_types/restaurants/entries?environment=${this.environment}`,
        {
          headers: {
            'api_key': this.apiKey,
            'access_token': this.deliveryToken,
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      return (data.entries || []).map((entry: any) => ({
        uid: entry.uid,
        title: entry.title,
        email: entry.email,
        phone: entry.phone,
        address: entry.address,
      }));
    } catch (error) {
      this.logger.error(`Error fetching restaurants: ${error.message}`);
      return [];
    }
  }

  // ============================================
  // OFFERS MANAGEMENT
  // ============================================

  async getOfferByCode(code: string): Promise<Offer | null> {
    try {
      const response = await fetch(
        `${this.deliveryBaseUrl}/content_types/offers/entries?query={"code":"${code}","is_active":true}&environment=${this.environment}`,
        {
          headers: {
            'api_key': this.apiKey,
            'access_token': this.deliveryToken,
          },
        }
      );

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
    } catch (error) {
      this.logger.error(`Error fetching offer: ${error.message}`);
      return null;
    }
  }

  async getActiveOffers(): Promise<Offer[]> {
    try {
      const response = await fetch(
        `${this.deliveryBaseUrl}/content_types/offers/entries?query={"is_active":true}&environment=${this.environment}`,
        {
          headers: {
            'api_key': this.apiKey,
            'access_token': this.deliveryToken,
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      
      if (!data.entries) {
        return [];
      }

      const now = new Date();
      
      return data.entries
        .filter((entry: any) => {
          if (entry.valid_from && new Date(entry.valid_from) > now) return false;
          if (entry.valid_until && new Date(entry.valid_until) < now) return false;
          return true;
        })
        .map((entry: any) => ({
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
    } catch (error) {
      this.logger.error(`Error fetching offers: ${error.message}`);
      return [];
    }
  }

  async getOffersByRestaurant(restaurantUid: string): Promise<Offer[]> {
    const allOffers = await this.getActiveOffers();
    return allOffers.filter(
      offer => !offer.applicableRestaurants || 
               offer.applicableRestaurants.length === 0 ||
               offer.applicableRestaurants.includes(restaurantUid)
    );
  }

  async getOffersByCategory(category: string): Promise<Offer[]> {
    const allOffers = await this.getActiveOffers();
    return allOffers.filter(
      offer => !offer.applicableCategories || 
               offer.applicableCategories.length === 0 ||
               offer.applicableCategories.includes(category)
    );
  }

  // ============================================
  // CITY-BASED PERSONALIZATION
  // ============================================

  async getRestaurantsByCity(city: string): Promise<Restaurant[]> {
    try {
      const response = await fetch(
        `${this.deliveryBaseUrl}/content_types/restaurants/entries?query={"city":"${city}"}&environment=${this.environment}`,
        {
          headers: {
            'api_key': this.apiKey,
            'access_token': this.deliveryToken,
          },
        }
      );

      if (!response.ok) {
        this.logger.warn(`No restaurants found for city: ${city}`);
        return [];
      }

      const data = await response.json();

      return (data.entries || []).map((entry: any) => ({
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
    } catch (error) {
      this.logger.error(`Error fetching restaurants by city: ${error.message}`);
      return [];
    }
  }

  async getOffersByCity(city: string): Promise<Offer[]> {
    try {
      const response = await fetch(
        `${this.deliveryBaseUrl}/content_types/offers/entries?query={"$or":[{"city":"${city}"},{"city":"All"}],"is_active":true}&environment=${this.environment}`,
        {
          headers: {
            'api_key': this.apiKey,
            'access_token': this.deliveryToken,
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      
      if (!data.entries) {
        return [];
      }

      const now = new Date();
      
      return data.entries
        .filter((entry: any) => {
          if (entry.valid_from && new Date(entry.valid_from) > now) return false;
          if (entry.valid_until && new Date(entry.valid_until) < now) return false;
          return true;
        })
        .map((entry: any) => ({
          code: entry.code,
          description: entry.description,
          discountType: entry.discount_type,
          discountValue: entry.discount_value,
          minOrderValue: entry.min_order_value,
          maxDiscount: entry.max_discount,
          city: entry.city,
          isActive: entry.is_active,
        }));
    } catch (error) {
      this.logger.error(`Error fetching offers by city: ${error.message}`);
      return [];
    }
  }

  async getCarouselByCity(city: string): Promise<any | null> {
    try {
      const response = await fetch(
        `${this.deliveryBaseUrl}/content_types/carousel/entries?environment=${this.environment}`,
        {
          headers: {
            'api_key': this.apiKey,
            'access_token': this.deliveryToken,
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const entries = data.entries || [];
      
      // Find city-specific carousel
      const cityCarousel = entries.find((entry: any) => 
        entry.title?.toLowerCase().includes(city.toLowerCase())
      );
      
      if (cityCarousel) {
        return cityCarousel;
      }
      
      // Fallback to default (first one without city name)
      const defaultCarousel = entries.find((entry: any) => 
        !entry.title?.toLowerCase().includes('chennai') && 
        !entry.title?.toLowerCase().includes('coimbatore') &&
        !entry.title?.toLowerCase().includes('tuticorin')
      ) || entries[0];
      
      return defaultCarousel || null;
    } catch (error) {
      this.logger.error(`Error fetching carousel by city: ${error.message}`);
      return null;
    }
  }
}
