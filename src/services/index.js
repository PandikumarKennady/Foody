/**
 * Services Index
 * 
 * Central export for all service modules
 */

const { 
  ContentService, 
  initializeContentService, 
  getContentService 
} = require('./content.service');

const { 
  OrderService, 
  getOrderService 
} = require('./order.service');

const EmailTemplateService = require('./email-template.service');

// Note: personalize.service.js uses ES modules and is imported directly where needed

module.exports = {
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

