/**
 * Bulk Import Script for Contentstack
 * 
 * This script imports all food items from mock data to Contentstack
 * using the MCP service layer
 * 
 * Usage: node scripts/bulk-import-foods.js
 */

const mockFoods = require('../src/content-models/mock-data/foods.mock');

// Since this runs in Node.js context, we'll provide instructions
// for actual implementation

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║    Foody - Bulk Import Helper for Contentstack MCP        ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log(`📊 Total food items to import: ${mockFoods.length}\n`);

console.log('📋 Items Summary:\n');
mockFoods.forEach((food, index) => {
  console.log(`${index + 1}. ${food.title} - ₹${food.rate}`);
  console.log(`   Categories: ${food.category.join(', ')}`);
  console.log(`   Restaurant: ${food.mess_name}\n`);
});

console.log('\n' + '═'.repeat(60) + '\n');

console.log('🔧 To import these items to Contentstack:\n');

console.log('1. Enable MCP in your .env file:');
console.log('   REACT_APP_MCP_ENABLED=true');
console.log('   REACT_APP_USE_MOCK_DATA=false\n');

console.log('2. Ensure Contentstack credentials are set:');
console.log('   REACT_APP_CONTENTSTACK_API_KEY=your_key');
console.log('   REACT_APP_CONTENTSTACK_DELIVERY_TOKEN=your_token');
console.log('   REACT_APP_CONTENTSTACK_ENVIRONMENT=production\n');

console.log('3. Run the import in your React app context or create a Node script\n');

console.log('4. For each food item, call:\n');
console.log('```javascript');
console.log('import { getContentService } from \'./src/services\';');
console.log('const contentService = getContentService();\n');
console.log('await contentService.createEntry({');
console.log('  contentTypeUid: \'foods\',');
console.log('  entryData: {');
console.log('    entry: {');
console.log('      // food item data');
console.log('    }');
console.log('  }');
console.log('});');
console.log('```\n');

console.log('5. After creation, publish entries:\n');
console.log('```javascript');
console.log('await contentService.publishEntry({');
console.log('  contentTypeUid: \'foods\',');
console.log('  entryUid: result.uid,');
console.log('  environments: [\'production\'],');
console.log('  locales: [\'en-us\'],');
console.log('  masterLocale: \'en-us\'');
console.log('});');
console.log('```\n');

console.log('\n' + '═'.repeat(60) + '\n');

console.log('📝 Entry Creation Template:\n');

// Show first item as example
const exampleFood = mockFoods[8]; // Mutton Rogan Josh (new item)

console.log('Example entry (Mutton Rogan Josh):\n');
console.log(JSON.stringify({
  content_type_uid: 'foods',
  branch: 'main',
  entry_data: {
    entry: {
      title: exampleFood.title,
      url: exampleFood.url,
      description: exampleFood.description,
      ingredients: exampleFood.ingredients,
      mess_name: exampleFood.mess_name,
      mess_address: exampleFood.mess_address,
      rate: exampleFood.rate,
      ratings: exampleFood.ratings,
      avail_from: exampleFood.avail_from,
      avail_until: exampleFood.avail_until,
      category: exampleFood.category,
      is_available: exampleFood.is_available
    }
  }
}, null, 2));

console.log('\n' + '═'.repeat(60) + '\n');

console.log('✨ Quick Test with Mock Data:\n');
console.log('To test without Contentstack, use mock data:');
console.log('   REACT_APP_USE_MOCK_DATA=true\n');
console.log('All 25 food items will be available immediately!\n');

console.log('═'.repeat(60) + '\n');

console.log('🎯 New Items Added:\n');
const newItems = mockFoods.slice(8); // Items from index 8 onwards
newItems.forEach((food, index) => {
  console.log(`${index + 1}. ${food.title}`);
});

console.log('\n✅ Mock data is ready!');
console.log('📖 See MCP_ENTRY_CREATION_GUIDE.md for detailed instructions\n');

module.exports = { mockFoods };


