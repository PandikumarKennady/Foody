/**
 * Category Statistics Script
 * 
 * Analyzes food items by category
 */

const mockFoods = require('../src/content-models/mock-data/foods.mock');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║        Foody - Category Statistics & Analysis             ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Collect all categories
const categoryMap = new Map();

mockFoods.forEach(food => {
  food.category.forEach(cat => {
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat).push(food.title);
  });
});

// Sort by count
const sortedCategories = Array.from(categoryMap.entries())
  .sort((a, b) => b[1].length - a[1].length);

console.log('📊 Food Items by Category:\n');
console.log('┌─────────────────────────┬───────┐');
console.log('│ Category                │ Count │');
console.log('├─────────────────────────┼───────┤');

sortedCategories.forEach(([category, items]) => {
  const paddedCategory = category.padEnd(23);
  const count = String(items.length).padStart(5);
  console.log(`│ ${paddedCategory} │ ${count} │`);
});

console.log('└─────────────────────────┴───────┘\n');

// Price statistics
const prices = mockFoods.map(f => f.rate);
const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);

console.log('💰 Price Statistics:\n');
console.log(`   Average: ₹${avgPrice.toFixed(2)}`);
console.log(`   Minimum: ₹${minPrice}`);
console.log(`   Maximum: ₹${maxPrice}\n`);

// Rating statistics
const ratings = mockFoods.map(f => f.ratings.value);
const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
const minRating = Math.min(...ratings);
const maxRating = Math.max(...ratings);

console.log('⭐ Rating Statistics:\n');
console.log(`   Average: ${avgRating.toFixed(2)}/5.0`);
console.log(`   Minimum: ${minRating}/5.0`);
console.log(`   Maximum: ${maxRating}/5.0\n`);

// Restaurant statistics
const restaurants = new Map();
mockFoods.forEach(food => {
  restaurants.set(food.mess_name, (restaurants.get(food.mess_name) || 0) + 1);
});

console.log('🏪 Top Restaurants:\n');
const topRestaurants = Array.from(restaurants.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

topRestaurants.forEach(([restaurant, count], index) => {
  console.log(`   ${index + 1}. ${restaurant} (${count} items)`);
});

console.log('\n' + '═'.repeat(60) + '\n');

console.log('🎯 Top 5 Most Popular Items:\n');
const topRated = [...mockFoods]
  .sort((a, b) => b.ratings.value - a.ratings.value)
  .slice(0, 5);

topRated.forEach((food, index) => {
  console.log(`   ${index + 1}. ${food.title}`);
  console.log(`      Rating: ${food.ratings.value}/5.0 | Price: ₹${food.rate}`);
  console.log(`      ${food.mess_name}\n`);
});

console.log('═'.repeat(60) + '\n');

console.log('💡 Recommendations:\n');
console.log('   • Most popular category: ' + sortedCategories[0][0]);
console.log('   • Average price point: ₹' + avgPrice.toFixed(0));
console.log('   • Highest rated: ' + topRated[0].title);
console.log('   • Budget option: ' + mockFoods.find(f => f.rate === minPrice).title);
console.log('   • Premium option: ' + mockFoods.find(f => f.rate === maxPrice).title);

console.log('\n✨ Analysis complete!\n');


