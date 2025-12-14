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
export declare class ContentstackService {
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly deliveryToken;
    private readonly managementToken;
    private readonly environment;
    private readonly deliveryBaseUrl;
    private readonly cmaBaseUrl;
    constructor(configService: ConfigService);
    createRestaurant(data: CreateRestaurantDto): Promise<Restaurant | null>;
    findRestaurantByName(name: string): Promise<Restaurant | null>;
    publishEntry(contentTypeUid: string, entryUid: string): Promise<boolean>;
    getRestaurantByUid(uid: string): Promise<Restaurant | null>;
    getAllRestaurants(): Promise<Restaurant[]>;
    getOfferByCode(code: string): Promise<Offer | null>;
    getActiveOffers(): Promise<Offer[]>;
    getOffersByRestaurant(restaurantUid: string): Promise<Offer[]>;
    getOffersByCategory(category: string): Promise<Offer[]>;
    getRestaurantsByCity(city: string): Promise<Restaurant[]>;
    getOffersByCity(city: string): Promise<Offer[]>;
    getCarouselByCity(city: string): Promise<any | null>;
}
