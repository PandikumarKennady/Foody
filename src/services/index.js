/**
 * Services Index
 * 
 * Central export for all service modules
 */

import { 
  ContentService, 
  initializeContentService, 
  getContentService 
} from './content.service';

import { 
  OrderService, 
  getOrderService 
} from './order.service';

import EmailTemplateService from './email-template.service';

// Note: personalize.service.js uses ES modules and is imported directly where needed

export {
  // Content Service
  ContentService,
  initializeContentService,
  getContentService,
  
  // Order Service
  OrderService,
  getOrderService,
  
  // Email Template Service
  EmailTemplateService
};

