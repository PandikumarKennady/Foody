/**
 * Script to upload images for food entries missing dish_image
 * 
 * This script uses Contentstack Management API to:
 * 1. Upload images from URLs to Contentstack Assets
 * 2. Update food entries with the uploaded asset
 * 
 * Usage: node scripts/upload-missing-images.js
 * 
 * Prerequisites:
 * - Set CONTENTSTACK_API_KEY and CONTENTSTACK_MANAGEMENT_TOKEN in .env
 */

require('dotenv').config();
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_KEY = process.env.REACT_APP_CONTENTSTACK_API_KEY;
const MANAGEMENT_TOKEN = process.env.REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN;
const CMA_HOST = process.env.REACT_APP_CONTENTSTACK_CMA_HOST || 'api.contentstack.io';
const BRANCH = process.env.REACT_APP_CONTENTSTACK_BRANCH || 'main';

// Food items missing images with suggested image URLs from Unsplash
const MISSING_IMAGES = [
  {
    uid: 'blt41cfba91bef2f47a',
    title: 'Cold Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80',
    filename: 'cold-coffee.jpg'
  },
  {
    uid: 'blt92a65ac6c46add6d',
    title: 'Manchurian Gravy',
    imageUrl: 'https://images.unsplash.com/photo-1645696301019-35adcc18fc95?w=800&q=80',
    filename: 'manchurian-gravy.jpg'
  },
  {
    uid: 'bltc6ec7c1b5057b12a',
    title: 'Medu Vada',
    imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80',
    filename: 'medu-vada.jpg'
  },
  {
    uid: 'bltbe038cfe0e55baa1',
    title: 'Squid Pepper Fry',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    filename: 'squid-pepper-fry.jpg'
  },
  {
    uid: 'bltbb80e287d755086f',
    title: 'Mutton Keema',
    imageUrl: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=800&q=80',
    filename: 'mutton-keema.jpg'
  },
  {
    uid: 'blt83ac53a2134b0494',
    title: 'Fresh Lime Soda',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    filename: 'fresh-lime-soda.jpg'
  },
  {
    uid: 'bltc32fb38c2c364b7b',
    title: 'Chilli Chicken',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
    filename: 'chilli-chicken.jpg'
  },
  {
    uid: 'blt910478729f2ef803',
    title: 'Idli Sambar',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    filename: 'idli-sambar.jpg'
  },
  {
    uid: 'bltedb664cb2fef97a7',
    title: 'Crab Masala',
    imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80',
    filename: 'crab-masala.jpg'
  },
  {
    uid: 'blt3e02cf7904f9617a',
    title: 'Butter Chicken',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
    filename: 'butter-chicken.jpg'
  },
  {
    uid: 'blta03456576081d6bf',
    title: 'Mango Lassi',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80',
    filename: 'mango-lassi.jpg'
  },
  {
    uid: 'blt8e8dd3404c561eff',
    title: 'Veg Fried Rice',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
    filename: 'veg-fried-rice.jpg'
  },
  {
    uid: 'bltf0d797f21f4239ec',
    title: 'Fish Fry',
    imageUrl: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&q=80',
    filename: 'fish-fry.jpg'
  },
  {
    uid: 'blt4319e657e6b6a567',
    title: 'Masala Dosa',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80',
    filename: 'masala-dosa.jpg'
  },
  {
    uid: 'bltf48f607e52dbc488',
    title: 'Chicken Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    filename: 'chicken-biryani.jpg'
  },
  {
    uid: 'blt460643cac6a05357',
    title: 'Schezwan Noodles',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    filename: 'schezwan-noodles.jpg'
  },
  {
    uid: 'blt6e0f7390bab99e46',
    title: 'Prawn Curry',
    imageUrl: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80',
    filename: 'prawn-curry.jpg'
  },
  {
    uid: 'blt976827d3ee5b51e7',
    title: 'Paneer Butter Masala',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80',
    filename: 'paneer-butter-masala.jpg'
  },
  {
    uid: 'blt04ebec2a5af957c4',
    title: 'Tandoori Chicken Special',
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
    filename: 'tandoori-chicken.jpg'
  }
];

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Upload asset to Contentstack
async function uploadAsset(filepath, title) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('asset[upload]', fs.createReadStream(filepath));
    form.append('asset[title]', title);
    
    const options = {
      hostname: CMA_HOST,
      path: '/v3/assets',
      method: 'POST',
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'branch': BRANCH,
        ...form.getHeaders()
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.asset) {
            resolve(json.asset);
          } else {
            reject(new Error(json.error_message || 'Upload failed'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    form.pipe(req);
  });
}

// Update entry with asset
async function updateEntryWithImage(entryUid, assetUid) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      entry: {
        dish_image: assetUid
      }
    });
    
    const options = {
      hostname: CMA_HOST,
      path: `/v3/content_types/foods/entries/${entryUid}`,
      method: 'PUT',
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'branch': BRANCH,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          if (json.entry) {
            resolve(json.entry);
          } else {
            reject(new Error(json.error_message || 'Update failed'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Main function
async function main() {
  console.log('🍽️  Foody Image Upload Script');
  console.log('================================\n');
  
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    console.error('❌ Error: Missing CONTENTSTACK_API_KEY or CONTENTSTACK_MANAGEMENT_TOKEN');
    console.log('\nPlease set these in your .env file:');
    console.log('REACT_APP_CONTENTSTACK_API_KEY=your_api_key');
    console.log('REACT_APP_CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token');
    process.exit(1);
  }
  
  // Create temp directory for downloads
  const tempDir = path.join(__dirname, 'temp-images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const item of MISSING_IMAGES) {
    console.log(`\n📷 Processing: ${item.title}`);
    
    try {
      // Step 1: Download image
      const filepath = path.join(tempDir, item.filename);
      console.log(`   ⬇️  Downloading image...`);
      await downloadImage(item.imageUrl, filepath);
      
      // Step 2: Upload to Contentstack
      console.log(`   ⬆️  Uploading to Contentstack...`);
      const asset = await uploadAsset(filepath, item.title);
      console.log(`   ✅ Asset created: ${asset.uid}`);
      
      // Step 3: Update entry
      console.log(`   🔗 Linking to entry...`);
      await updateEntryWithImage(item.uid, asset.uid);
      console.log(`   ✅ Entry updated!`);
      
      // Clean up downloaded file
      fs.unlinkSync(filepath);
      
      successCount++;
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failCount++;
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Cleanup temp directory
  try {
    fs.rmdirSync(tempDir);
  } catch (e) {}
  
  console.log('\n================================');
  console.log(`✅ Success: ${successCount}/${MISSING_IMAGES.length}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}/${MISSING_IMAGES.length}`);
  }
  console.log('\n🎉 Done! Refresh your app to see the images.');
}

main().catch(console.error);

