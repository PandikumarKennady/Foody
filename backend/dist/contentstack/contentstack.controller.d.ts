import { ContentstackService } from './contentstack.service';
export declare class ContentstackController {
    private readonly contentstackService;
    constructor(contentstackService: ContentstackService);
    getActiveOffers(): Promise<import("./contentstack.service").Offer[]>;
    validateOfferCode(code: string): Promise<{
        valid: boolean;
        message: string;
        offer?: undefined;
    } | {
        valid: boolean;
        offer: import("./contentstack.service").Offer;
        message?: undefined;
    }>;
    getOffersByRestaurant(restaurantUid: string): Promise<import("./contentstack.service").Offer[]>;
    getOffersByCategory(category: string): Promise<import("./contentstack.service").Offer[]>;
    getOffersByCity(city: string): Promise<import("./contentstack.service").Offer[]>;
}
export declare class PersonalizeController {
    private readonly contentstackService;
    constructor(contentstackService: ContentstackService);
    getRestaurantsByCity(city: string): Promise<import("./contentstack.service").Restaurant[]>;
    getCarouselByCity(city: string): Promise<any>;
    getPersonalizedContent(city: string): Promise<{
        city: string;
        restaurants: import("./contentstack.service").Restaurant[];
        carousel: any;
        offers: import("./contentstack.service").Offer[];
    }>;
}
