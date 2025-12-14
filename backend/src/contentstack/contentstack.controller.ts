import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ContentstackService } from './contentstack.service';

@ApiTags('offers')
@Controller('offers')
export class ContentstackController {
  constructor(private readonly contentstackService: ContentstackService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active offers' })
  async getActiveOffers() {
    return this.contentstackService.getActiveOffers();
  }

  @Get('validate/:code')
  @ApiOperation({ summary: 'Validate an offer code' })
  async validateOfferCode(@Param('code') code: string) {
    const offer = await this.contentstackService.getOfferByCode(code);
    if (!offer) {
      return { valid: false, message: 'Invalid or expired offer code' };
    }
    return { valid: true, offer };
  }

  @Get('by-restaurant/:restaurantUid')
  @ApiOperation({ summary: 'Get offers applicable to a restaurant' })
  async getOffersByRestaurant(@Param('restaurantUid') restaurantUid: string) {
    return this.contentstackService.getOffersByRestaurant(restaurantUid);
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Get offers applicable to a category' })
  @ApiQuery({ name: 'category', required: true })
  async getOffersByCategory(@Query('category') category: string) {
    return this.contentstackService.getOffersByCategory(category);
  }

  @Get('by-city/:city')
  @ApiOperation({ summary: 'Get offers by city' })
  async getOffersByCity(@Param('city') city: string) {
    return this.contentstackService.getOffersByCity(city);
  }
}

// Personalization Controller for City-based Content
@ApiTags('personalize')
@Controller('personalize')
export class PersonalizeController {
  constructor(private readonly contentstackService: ContentstackService) {}

  @Get('restaurants/:city')
  @ApiOperation({ summary: 'Get restaurants by city for personalization' })
  async getRestaurantsByCity(@Param('city') city: string) {
    return this.contentstackService.getRestaurantsByCity(city);
  }

  @Get('carousel/:city')
  @ApiOperation({ summary: 'Get personalized carousel by city' })
  async getCarouselByCity(@Param('city') city: string) {
    return this.contentstackService.getCarouselByCity(city);
  }

  @Get('content/:city')
  @ApiOperation({ summary: 'Get all personalized content for a city' })
  async getPersonalizedContent(@Param('city') city: string) {
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
}

