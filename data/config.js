/**
 * KraftAmore - Store & Business Configuration
 * Hand-Painted Canvas Bags, Indian Festive Torans, Door Hangings & Gujarati Handicrafts
 */

const STORE_CONFIG = {
  brandName: "KraftAmore",
  tagline: "Creations • Crafts • Happiness",
  subTagline: "Hand-Painted Canvas Bags • Indian Festive Torans • Gujarati Handicrafts",
  logo: "assets/images/logo/logo.png",
  ownerName: "KraftAmore Studio",
  establishedYear: 2024,
  location: "Gujarat, India • Pan-India & Worldwide Shipping",

  // WhatsApp Inquiry Details
  whatsappNumber: "919876543210", 
  whatsappDisplay: "+91 98765 43210",

  // Email Inquiry Details
  email: "hello.kraftamore@gmail.com",

  // Instagram Profile
  instagramHandle: "kraftamore.in",
  instagramUrl: "https://www.instagram.com/kraftamore.in",

  // Cultural Hashtags & Badges
  hashtags: [
    "#HandmadeWithLove",
    "#HomeSweetHome",
    "#DiwaliDecor",
    "#DoorHangings",
    "#VocalForLocal",
    "#ArtisanMade",
    "#GujaratiHandicrafts"
  ],

  // Currency & Display
  currencySymbol: "₹",
  freeShippingThreshold: 1499,

  // Announcements & Banner
  announcementText: "✨ FESTIVE DROP LIVE • HANDCRAFTED TORANS, DIWALI DECOR & HAND-PAINTED BAGS • #VOCALFORLOCAL 🪔"
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = STORE_CONFIG;
}
