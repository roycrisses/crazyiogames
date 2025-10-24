# What's My Phone Worth? - Used Phone Value Checker

A simple, minimal black and white website that helps users check the resale value of their used phones.

## Features

- Clean, minimal black and white design with sharp corners
- **3-Step Valuation Process:**
  - **Step 1:** Searchable phone database with 70+ phone models from major brands
  - **Step 2:** Detailed specifications (Storage: 64GB-1TB, RAM: 4-16GB, Condition)
  - **Step 3:** Optional multi-angle photo upload (6 views: front, back, top, bottom, left, right)
- **AI-Powered Condition Detection:**
  - Upload front photo → AI analyzes automatically
  - Uses Google Vision Transformer (free via Hugging Face)
  - Auto-selects condition based on detected wear/damage
  - Shows confidence score and classification results
- **Advanced Price Calculation:**
  - Base price from market data
  - Storage capacity adjustments (+/- up to $150)
  - Condition-based multipliers (Mint: +15%, Excellent: base, Good: -15%, Fair: -35%, Poor: -55%)
  - Detailed price breakdown display
- Real-time search filtering as you type
- Image upload with instant preview
- Price trend indicators
- Affiliate links to eBay, Swappa, and Amazon Renewed
- Mobile responsive (2-column grid on mobile)
- SEO optimized for phone resale value searches

## Supported Brands

The database includes 70+ phone models from:
- **Apple** (iPhone 15 series, 14 series, 13 series, 12 series, SE, XR, X)
- **Samsung** (Galaxy S24/S23/S22/S21 series, Z Fold/Flip, A-series)
- **Google** (Pixel 8, 7, 6 series)
- **OnePlus** (12, 11, 10 Pro, Nord 3)
- **Xiaomi** (13 series, 12 Pro, Redmi Note)
- **Motorola** (Edge, Razr, Moto G)
- **Sony** (Xperia 1 V, 5 V)
- **Nothing, ASUS, OPPO, Vivo, Realme, Honor, Huawei, Nokia, LG**

## Files

- `index.html` - Main HTML structure with searchable interface
- `styles.css` - Minimal black and white styling
- `script.js` - JavaScript for search, filtering, AI analysis, and affiliate links
- `phones.json` - Phone price database (update monthly)
- `config.js` - API configuration (contains Hugging Face token)
- `.gitignore` - Protects config.js from being committed

## Setup Instructions

1. **API Token (Already Configured):**
   - Your Hugging Face token is stored in `config.js`
   - ⚠️ **Never share or commit `config.js` to public repositories**
   - The `.gitignore` file protects it automatically

2. **Test Locally:**
   - Open `index.html` in a browser
   - AI analysis works immediately (no backend needed!)

3. **How AI Works:**
   - Upload a front photo of the phone
   - AI analyzes using Google's Vision Transformer model
   - Automatically suggests condition (Mint/Excellent/Good/Fair/Poor)
   - You can override the AI suggestion manually if needed

## How to Update Prices (Monthly)

1. Open `phones.json`
2. Update the `lastUpdated` field with the current date (format: YYYY-MM-DD)
3. Update individual phone prices and trends as needed
4. Save the file

### Adding New Phones

To add a new phone to the database, add a new entry in the `phones` array:

```json
{
  "id": "unique-phone-id",
  "name": "Phone Model Name",
  "brand": "Brand Name",
  "price": 500,
  "trend": "Stable — description",
  "ebayQuery": "Phone+Model+Name+used",
  "swappaQuery": "phone-model-name",
  "amazonQuery": "Phone+Model+Name+Renewed"
}
```

## Monetization

### Affiliate Links

Update the affiliate link URLs in `script.js` to include your affiliate IDs:

```javascript
// eBay - Add your eBay Partner Network campaign ID
ebayLink.href = `https://www.ebay.com/sch/i.html?_nkw=${phone.ebayQuery}&campid=YOUR_CAMPAIGN_ID`;

// Amazon - Add your Amazon Associates tag
amazonLink.href = `https://www.amazon.com/s?k=${phone.amazonQuery}&tag=YOUR_ASSOCIATE_TAG`;
```

### Display Ads

Replace the ad placeholder in `index.html` (line 54-56) with your ad network code (Google AdSense, etc.)

## SEO Keywords Targeted

- iPhone 12 resale value
- phone value checker
- used phone worth
- phone resale price
- used iPhone value
- Samsung resale value

## Local Testing

Simply open `index.html` in a web browser to test locally.

## Deployment

Upload all files to your web hosting service. No build process required.

## Current Features vs Future Enhancements

### ✅ Already Implemented (100% Free)
- **AI Image Analysis** - Uses Hugging Face API (free tier)
  - Automatic condition detection from photos
  - Google Vision Transformer model
  - No backend server required

### 🔮 Future Enhancements

1. **Real-time Internet Price Lookup:**
   - Backend API integration with eBay Finding API (free: 5,000 calls/day)
   - Live price scraping from marketplaces
   - Dynamic price updates instead of monthly manual updates

2. **Enhanced AI Features:**
   - Specific phone model detection
   - Scratch/crack detection with bounding boxes
   - Screen condition analysis
   - Authenticity verification

3. **Database Integration:**
   - Move from JSON to database (PostgreSQL, MongoDB)
   - Real-time price tracking
   - Historical price trends and charts

4. **User Accounts:**
   - Save multiple phone valuations
   - Price drop alerts
   - Sell history tracking
