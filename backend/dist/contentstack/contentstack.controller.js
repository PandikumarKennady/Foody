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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalizeController = exports.ContentstackController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contentstack_service_1 = require("./contentstack.service");
let ContentstackController = class ContentstackController {
    constructor(contentstackService) {
        this.contentstackService = contentstackService;
    }
    async getActiveOffers() {
        return this.contentstackService.getActiveOffers();
    }
    async validateOfferCode(code) {
        const offer = await this.contentstackService.getOfferByCode(code);
        if (!offer) {
            return { valid: false, message: 'Invalid or expired offer code' };
        }
        return { valid: true, offer };
    }
    async getOffersByRestaurant(restaurantUid) {
        return this.contentstackService.getOffersByRestaurant(restaurantUid);
    }
    async getOffersByCategory(category) {
        return this.contentstackService.getOffersByCategory(category);
    }
    async getOffersByCity(city) {
        return this.contentstackService.getOffersByCity(city);
    }
};
exports.ContentstackController = ContentstackController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active offers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentstackController.prototype, "getActiveOffers", null);
__decorate([
    (0, common_1.Get)('validate/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate an offer code' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentstackController.prototype, "validateOfferCode", null);
__decorate([
    (0, common_1.Get)('by-restaurant/:restaurantUid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get offers applicable to a restaurant' }),
    __param(0, (0, common_1.Param)('restaurantUid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentstackController.prototype, "getOffersByRestaurant", null);
__decorate([
    (0, common_1.Get)('by-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get offers applicable to a category' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: true }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentstackController.prototype, "getOffersByCategory", null);
__decorate([
    (0, common_1.Get)('by-city/:city'),
    (0, swagger_1.ApiOperation)({ summary: 'Get offers by city' }),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentstackController.prototype, "getOffersByCity", null);
exports.ContentstackController = ContentstackController = __decorate([
    (0, swagger_1.ApiTags)('offers'),
    (0, common_1.Controller)('offers'),
    __metadata("design:paramtypes", [contentstack_service_1.ContentstackService])
], ContentstackController);
let PersonalizeController = class PersonalizeController {
    constructor(contentstackService) {
        this.contentstackService = contentstackService;
    }
    async getRestaurantsByCity(city) {
        return this.contentstackService.getRestaurantsByCity(city);
    }
    async getCarouselByCity(city) {
        return this.contentstackService.getCarouselByCity(city);
    }
    async getPersonalizedContent(city) {
        const [restaurants, carousel, offers] = await Promise.all([
            this.contentstackService.getRestaurantsByCity(city),
            this.contentstackService.getCarouselByCity(city),
            this.contentstackService.getOffersByCity(city),
        ]);
        return {
            city,
            restaurants,
            carousel,
            offers,
        };
    }
};
exports.PersonalizeController = PersonalizeController;
__decorate([
    (0, common_1.Get)('restaurants/:city'),
    (0, swagger_1.ApiOperation)({ summary: 'Get restaurants by city for personalization' }),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonalizeController.prototype, "getRestaurantsByCity", null);
__decorate([
    (0, common_1.Get)('carousel/:city'),
    (0, swagger_1.ApiOperation)({ summary: 'Get personalized carousel by city' }),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonalizeController.prototype, "getCarouselByCity", null);
__decorate([
    (0, common_1.Get)('content/:city'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all personalized content for a city' }),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonalizeController.prototype, "getPersonalizedContent", null);
exports.PersonalizeController = PersonalizeController = __decorate([
    (0, swagger_1.ApiTags)('personalize'),
    (0, common_1.Controller)('personalize'),
    __metadata("design:paramtypes", [contentstack_service_1.ContentstackService])
], PersonalizeController);
//# sourceMappingURL=contentstack.controller.js.map