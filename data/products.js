/**
 * ==============================================================================
 * KraftAmore - Product Catalog Data (2 Core Categories)
 * 1. Handpainted Canvas Bags (6 items)
 * 2. Indian Festive Torans & Door Hangings (6 items)
 * 
 * TO ADD A NEW PRODUCT:
 * Just copy the template below and paste it inside PRODUCTS_DATA!
 * Both the homepage carousel and the products page will update automatically!
 * 
 * TEMPLATE:
 * {
 *   id: "bag-07",
 *   name: "Your New Product Name",
 *   category: "bags", // Use "bags" or "torans"
 *   categoryName: "Handpainted Bags", // or "Indian Festive Torans"
 *   price: 799,
 *   originalPrice: 999,
 *   badge: "New Drop ✨",
 *   rating: 5.0,
 *   reviewsCount: 10,
 *   isFeatured: false,
 *   image: "assets/images/products/totes/your-image.jpg",
 *   description: "Write your description here...",
 *   dimensions: "15 x 16 inches",
 *   materials: "100% Cotton Canvas",
 *   customization: "Custom initials available",
 *   tags: ["bags", "handpainted", "canvas"]
 * }
 * ==============================================================================
 */

const CATEGORIES = [
  { 
    id: "all", 
    name: "All Creations", 
    icon: "✨",
    tagline: "Explore our complete handcrafted collection" 
  },
  { 
    id: "bags", 
    name: "Handpainted Bags", 
    icon: "👜", 
    tagline: "100% Heavyweight Cotton Canvas • Permanent Washable Paints • Eco-Friendly Fashion",
    image: "assets/images/products/totes/wildflower-canvas-tote.jpg"
  },
  { 
    id: "torans", 
    name: "Indian Festive Torans", 
    icon: "🪔", 
    tagline: "Traditional Door Hangings • Mirror Work • Auspicious Shubh-Labh & Brass Bells",
    image: "assets/images/products/torans/royal-shubh-labh-toran.jpg"
  }
];

const PRODUCTS_DATA = [
  // ==========================================
  // CATEGORY 1: HANDPAINTED BAGS (6 items)
  // ==========================================
  {
    id: "bag-01",
    name: "Wildflower Handpainted Canvas Tote Bag",
    category: "bags",
    categoryName: "Handpainted Bags",
    price: 749,
    originalPrice: 949,
    badge: "Bestseller 🌿",
    rating: 4.9,
    reviewsCount: 52,
    isFeatured: true,
    image: "assets/images/products/totes/wildflower-canvas-tote.jpg",
    description: "Everyday aesthetic tote bag crafted from 100% natural organic unbleached cotton canvas. Individually handpainted with colorful wildflower art using permanent, colorfast, and washable fabric paints. Features reinforced straps, bottom gusset, and inner pocket.",
    dimensions: "15 x 16 inches with a comfortable 10.5-inch shoulder drop",
    materials: "12oz 100% unbleached heavy cotton canvas, eco-friendly textile paints",
    customization: "Add your personalized handpainted name or initial on the corner for free",
    tags: ["bags", "handpainted", "canvas", "sustainable", "vocalforlocal", "artisanmade"]
  },
  {
    id: "bag-02",
    name: "Indian Lotus Handpainted Canvas Tote",
    category: "bags",
    categoryName: "Handpainted Bags",
    price: 799,
    originalPrice: 999,
    badge: "Staff Pick 🌸",
    rating: 4.8,
    reviewsCount: 31,
    isFeatured: true,
    image: "assets/images/products/totes/botanical-lineart-tote.jpg",
    description: "Modern off-white cotton canvas tote featuring an artistic handpainted pink Indian lotus blossom with delicate green foliage and golden line accents. Durable, washable, and spacious enough for laptop, books, and daily essentials.",
    dimensions: "14.5 x 15.5 inches with reinforced cross-stitched handles",
    materials: "Heavyweight organic cotton canvas with reinforced stitching",
    customization: "Available in Golden Lotus, Terracotta Rust, or Forest Green accents",
    tags: ["bags", "lotus", "handpainted", "everyday", "handmadewithlove"]
  },
  {
    id: "bag-03",
    name: "Bohemian Botanical Canvas Tote",
    category: "bags",
    categoryName: "Handpainted Bags",
    price: 849,
    originalPrice: 1099,
    badge: "New Drop ✨",
    rating: 5.0,
    reviewsCount: 19,
    isFeatured: false,
    image: "assets/images/products/totes/wildflower-canvas-tote.jpg",
    description: "Inspired by festive Indian botanicals, this canvas tote features vibrant handpainted floral sprays and leaves. Perfect for temple visits, weekend markets, festive gifting, and everyday boho styling.",
    dimensions: "15 x 16.5 inches with reinforced shoulder drop",
    materials: "100% natural organic cotton canvas, permanent acrylic textile colors",
    customization: "Choice of golden ochre or royal crimson base floral motif",
    tags: ["bags", "botanical", "festive", "handpainted", "gujaratiha"]
  },
  {
    id: "bag-04",
    name: "Artisan Zippered Canvas Pouch & Clutch",
    category: "bags",
    categoryName: "Handpainted Bags",
    price: 449,
    originalPrice: 599,
    badge: "Handmade ♡",
    rating: 4.8,
    reviewsCount: 22,
    isFeatured: false,
    image: "assets/images/products/totes/zipper-craft-pouch.jpg",
    description: "Handy multipurpose zippered canvas pouch handpainted with charming miniature botanicals. Fitted with an antique brass zipper and soft inner cotton lining. Ideal for cosmetics, keys, stationery, or as a festive gift pouch.",
    dimensions: "8.5 x 6 inches with a 2-inch flat base",
    materials: "Heavy natural canvas with soft cotton inner lining and brass metal pull",
    customization: "Personalized monogram letter handpainted on the back",
    tags: ["bags", "pouch", "accessories", "gifts", "handpainted"]
  },
  {
    id: "bag-05",
    name: "Sunburst Floral Canvas Everyday Shoulder Bag",
    category: "bags",
    categoryName: "Handpainted Bags",
    price: 699,
    originalPrice: 899,
    badge: "Cute & Minimal 🌼",
    rating: 4.7,
    reviewsCount: 26,
    isFeatured: false,
    image: "assets/images/products/totes/botanical-lineart-tote.jpg",
    description: "Minimalist floral art handpainted on creamy unbleached canvas. A lightweight, aesthetic shoulder bag that pairs effortlessly with ethnic kurtas, casual denim, and cafe outfits.",
    dimensions: "14 x 15 inches",
    materials: "Unbleached organic cotton canvas",
    customization: "Custom quote or date handpainted below the flowers",
    tags: ["bags", "minimalist", "daisy", "canvas", "handpainted"]
  },
  {
    id: "bag-06",
    name: "Botanical Monogram Canvas Gift Bag",
    category: "bags",
    categoryName: "Handpainted Bags",
    price: 799,
    originalPrice: 999,
    badge: "Custom Order ✍️",
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: false,
    image: "assets/images/products/totes/wildflower-canvas-tote.jpg",
    description: "Customized canvas tote with your initial letter intertwined with handpainted delicate botanical vines and flowers. A cherished personalized gift for birthdays, bridesmaids, and besties.",
    dimensions: "15 x 16 inches",
    materials: "100% cotton canvas with personalized calligraphy & botanical art",
    customization: "Choose any English or Hindi letter / initial and floral color theme",
    tags: ["bags", "monogram", "personalized", "customgift", "handmadewithlove"]
  },

  // ==========================================
  // CATEGORY 2: INDIAN FESTIVE TORANS (6 items)
  // ==========================================
  {
    id: "toran-01",
    name: "Royal Shubh-Labh Festive Entrance Toran",
    category: "torans",
    categoryName: "Indian Festive Torans",
    price: 1299,
    originalPrice: 1599,
    badge: "Diwali Bestseller ✨",
    rating: 5.0,
    reviewsCount: 48,
    isFeatured: true,
    image: "assets/images/products/torans/royal-shubh-labh-toran.jpg",
    description: "Exquisite handmade Indian main entrance door bandhanwar crafted with auspicious Shubh-Labh wooden plaques, authentic Gujarati glass mirror work, marigold garlands, and golden tinkling brass bells. Brings prosperity and blessings.",
    dimensions: "Standard 3.2 ft / 3.5 ft width (Fits standard entrance door frames)",
    materials: "Handpainted seasoned wood, fabric marigolds, antique brass bells, glass mirrors",
    customization: "Available in custom door widths (3 ft to 4.5 ft) and choice of Red-Gold or Yellow theme",
    tags: ["torans", "shubhlabh", "diwalidecor", "doorhangings", "vocalforlocal", "gujaratiha"]
  },
  {
    id: "toran-02",
    name: "Authentic Gujarati Mirror Work Festive Toran",
    category: "torans",
    categoryName: "Indian Festive Torans",
    price: 1099,
    originalPrice: 1399,
    badge: "Gujarati Craft 🪞",
    rating: 4.9,
    reviewsCount: 36,
    isFeatured: true,
    image: "assets/images/products/torans/gujarati-mirror-toran.jpg",
    description: "Vibrant festive door hanging inspired by authentic Gujarati Kutch handicraft traditions. Features circular reflective glass mirrors (abhla work), golden gota-patti border, marigold flower tassels, and antique brass bells.",
    dimensions: "3.5 ft width with sturdy brass hanging loops on both ends",
    materials: "Authentic mirror accents, golden gota patti, marigold tassels, brass bells",
    customization: "Can be customized with matching side door hanging latkans",
    tags: ["torans", "marigold", "gujaratihandicrafts", "festive", "homesweethome"]
  },
  {
    id: "toran-03",
    name: "Auspicious Marigold & Brass Bell Bandhanwar",
    category: "torans",
    categoryName: "Indian Festive Torans",
    price: 949,
    originalPrice: 1199,
    badge: "Festive Favorite 🪔",
    rating: 4.9,
    reviewsCount: 29,
    isFeatured: true,
    image: "assets/images/products/torans/royal-shubh-labh-toran.jpg",
    description: "Traditional auspicious entrance garland with vibrant saffron and yellow marigolds, circular mirror studs, and hanging brass ghungroos that produce a gentle chime when your entrance door opens.",
    dimensions: "3.5 ft width (Set of 1 door bandhanwar)",
    materials: "Handcrafted fabric marigolds, glass mirrors, antique brass bells",
    customization: "Choice of Royal Peacock Blue or Festive Crimson & Gold accents",
    tags: ["torans", "peacock", "latkans", "diwalidecor", "doorhangings"]
  },
  {
    id: "toran-04",
    name: "Home Sweet Home Auspicious Plaque Toran",
    category: "torans",
    categoryName: "Indian Festive Torans",
    price: 899,
    originalPrice: 1149,
    badge: "Home Sweet Home 🏡",
    rating: 4.8,
    reviewsCount: 42,
    isFeatured: true,
    image: "assets/images/products/torans/gujarati-mirror-toran.jpg",
    description: "Warm and inviting entrance door toran featuring a centerpiece 'Home Sweet Home' wooden plaque flanked by Gujarati mirror motifs, marigold tassels, and brass bells. Perfect housewarming gift.",
    dimensions: "3.2 ft standard width, 8-inch central plaque drop",
    materials: "Laser-cut handpainted wood, jute cords, brass bells, acrylic colors",
    customization: "Can personalize with your Family Name (e.g. 'The Sharmas')",
    tags: ["torans", "homesweethome", "grihapravesh", "doorhangings", "giftideas"]
  },
  {
    id: "toran-05",
    name: "Traditional Mango Leaves & Bell Bandhanwar",
    category: "torans",
    categoryName: "Indian Festive Torans",
    price: 849,
    originalPrice: 1049,
    badge: "Auspicious 🌿",
    rating: 4.7,
    reviewsCount: 24,
    isFeatured: false,
    image: "assets/images/products/torans/royal-shubh-labh-toran.jpg",
    description: "Classic Indian entrance bandhanwar featuring handcrafted dark green mango leaves, marigold floral clusters, and musical brass bells. Believed in Indian tradition to keep negative energy away.",
    dimensions: "3.5 ft length",
    materials: "Fabric mango foliage, felt marigolds, golden beads, brass bells",
    customization: "Custom length available on WhatsApp request",
    tags: ["torans", "mangoleaves", "traditional", "pooja", "diwalidecor"]
  },
  {
    id: "toran-06",
    name: "Handcrafted Shubh-Labh Hanging Cutouts (Pair)",
    category: "torans",
    categoryName: "Indian Festive Torans",
    price: 649,
    originalPrice: 799,
    badge: "Festive Must-Have ✨",
    rating: 4.9,
    reviewsCount: 35,
    isFeatured: false,
    image: "assets/images/products/torans/gujarati-mirror-toran.jpg",
    description: "Auspicious 'Shubh' and 'Labh' handpainted wooden door cutouts adorned with traditional Indian motifs, mirror studs, and hanging beads. Comes with adhesive backing for door frames or festive toran attachment.",
    dimensions: "5.5 inches each (Pair of Shubh and Labh)",
    materials: "Handpainted wood, glass mirrors, metallic gold accents",
    customization: "Choice of Traditional Maroon-Gold or Auspicious Haldi-Yellow",
    tags: ["torans", "shubhlabh", "diwalidecor", "doorhangings", "gujaratiha"]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATEGORIES, PRODUCTS_DATA };
}
