# KraftAmore • Creations • Crafts • Happiness

Official boutique website for **KraftAmore** ([@kraftamore.in](https://www.instagram.com/kraftamore.in)) — a small artisan business based in Gujarat, India, specializing in:
1. **100% Organic Handpainted Canvas Bags & Everyday Aesthetic Totes**
2. **Authentic Indian Festive Entrance Torans & Traditional Door Bandhanwars**

---

## 🌟 Features

- **100% Static & GitHub Ready**: Built with standard semantic HTML5, CSS3, modern Vanilla JavaScript, and Bootstrap 5 (via CDN). No npm builds, backend servers, or databases required.
- **Direct WhatsApp Ordering**: One-click pre-formatted WhatsApp inquiries for every handcrafted piece.
- **Inquiry Bag**: Customers can save multiple items to an inquiry bag and submit a bundled inquiry.
- **Interactive Products Catalog**: Instant category filtering, real-time search, sorting, and Quick View detail modal dialog.
- **Easy Product Management**: Adding new items is as simple as adding a JSON object to [`data/products.js`](data/products.js).

---

## 🚀 How to Publish to GitHub & GitHub Pages (Free Hosting)

This codebase works **100% out-of-the-box on GitHub Pages**. Follow these simple steps:

### Step 1: Create a GitHub Repository
1. Log in to your [GitHub](https://github.com/) account.
2. Click **New Repository** (e.g., name it `kraftamore` or `kraftamore-website`).
3. Leave it Public and click **Create repository**.

### Step 2: Push This Code to GitHub
Open your terminal inside this folder and run:

```bash
git init
git add .
git commit -m "Initial commit of KraftAmore website"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

*(Alternatively, you can simply drag and drop the files and folders directly into GitHub's web uploader!)*

### Step 3: Enable GitHub Pages (Free Live Website)
1. On your GitHub repository page, go to **Settings** (tab at the top).
2. On the left sidebar, click **Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Within 1–2 minutes, your website will be live at:
   `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## 📁 Project Structure

```
kraftamore-modern/
├── index.html                 # Boutique Home page & Featured Carousel
├── products.html              # Full Handcrafted Products Catalog with Filters
├── README.md                  # Documentation & Deployment Guide
├── data/
│   ├── config.js              # Store configuration (phone, email, Instagram)
│   └── products.js            # 12 handcrafted pieces data & easy-to-use template
└── assets/
    ├── css/
    │   └── modern.css         # Artisanal styling & responsive design
    ├── js/
    │   └── modern.js          # Interactive filtering, carousel, bag & search
    └── images/
        ├── logo/              # Circular KraftAmore logo (logo.png)
        ├── hero/              # Hero & artisanal banner illustrations
        ├── products/          # High-resolution handcrafted piece photos
        └── instagram/         # Lookbook studio gallery photos
```

---

## 💻 Local Preview

Simply double-click `index.html` in your file explorer to open it in any web browser.
