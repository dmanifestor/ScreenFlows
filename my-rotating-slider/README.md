# Rotating Content Slider

A fluid, production-ready circular rotating content slider inspired by high-end artisanal food and product showcases. Built with **pure HTML5, CSS3, Vanilla JavaScript, and GSAP**, with zero WordPress or Elementor dependencies.

Ready for direct deployment to **GitHub Pages** or any static web host.

---

## 🌟 Live Features

- **Circular Rotating Hero & Geometry**: Faithfully reproduces the circular composition with dynamic geometry (`--pie-size`, `--ring-size`, `--ring-gap`, `--shared-center-y`).
- **Curved Character Text Ring**: Each character is mathematically positioned along the radial arc (`flavor-char` rotation) and remains legible across all viewport sizes.
- **Dynamic Background Crossfade**: Smoothly blends gradient backdrops and photography without white flashes, blank frames, or clipping.
- **Synchronized Hero Transitions**: Features entry and exit rotations (`45deg` spin, scaling, and `back.out` easing) coordinated with the active slide.
- **Multi-Modal Controls**:
  - **Previous & Next circular arrow buttons** with hover glow.
  - **Clickable circular ring items** for direct navigation.
  - **Keyboard navigation**: Left/Right and Up/Down arrow keys.
  - **Touch gestures**: Swipe left or right on mobile and tablet touchscreens.
  - **Pagination dots**: Quick visual indicators of slide position.
- **Accessibility & Motion Safety**: Respects `prefers-reduced-motion` to provide instant, gentle fades for users sensitive to motion.
- **100% Standalone Static**: Runs without Node.js, Webpack, PHP, or databases.

---

## 📁 Project Structure

```text
my-rotating-slider/
├── index.html              # Semantic HTML5 markup and slider structure
├── style.css               # Pure CSS3 styling, circular layout, & responsive media queries
├── script.js               # Vanilla JS slider engine & GSAP animations
├── assets/
│   ├── images/             # Local hero pie bowls and background imagery
│   │   ├── kiwi-bowl.png
│   │   ├── kiwi-bg.png
│   │   ├── blackberry-bowl.png
│   │   ├── blackberry-bg.png
│   │   ├── banana-bowl.png
│   │   ├── banana-bg.png
│   │   ├── strawberry-bowl.png
│   │   └── strawberry-bg.png
│   ├── icons/              # Scalable vector graphics (SVG)
│   │   ├── cart.svg
│   │   ├── search.svg
│   │   ├── chevron-left.svg
│   │   └── chevron-right.svg
│   └── fonts/              # Typography references (DM Sans, Playfair Display)
└── README.md               # Documentation and deployment guide
```

---

## 🚀 How to Run Locally

Because this project is a pure static web application, you do not need any build step:

### Option 1: Direct File Opening
Double-click `index.html` in your file explorer to open it in Chrome, Safari, Firefox, or Edge.

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000`.

Using Node / npx:
```bash
npx serve .
```

Using VS Code:
Right click `index.html` and choose **"Open with Live Server"**.

---

## 🛠️ How to Customize Slides & Flavors

All slide data is stored in the semantic `#flavors-data` block inside `index.html` for clean separation of concerns:

```html
<article class="flavor-data">
  <!-- Slide Title -->
  <div class="flavor-name"><h3>Mango</h3></div>

  <!-- Background Accent Gradient or Solid Color -->
  <div class="flavor-color"><p>linear-gradient(270deg, #E65100 0%, #FFB300 100%)</p></div>

  <!-- Hero Circular Cutout Image -->
  <div class="flavor-image">
    <img src="./assets/images/mango-bowl.png" alt="Mango Pie Bowl" />
  </div>

  <!-- Fullscreen Background Photo -->
  <div class="flavor-bg-image">
    <img src="./assets/images/mango-bg.png" alt="Mango Orchard Background" />
  </div>

  <!-- Descriptive Copy -->
  <div class="flavor-desc">
    <p>Sweet and succulent Alphonso mangoes nestled in a flaky cardamom crust.</p>
  </div>
</article>
```

You can add as many items as you like. The circular geometry dynamically adjusts the character angles and rotation steps automatically.

---

## 🌐 GitHub Pages Deployment Guide

Deploying this site to GitHub Pages takes under 2 minutes:

### Step 1: Create a New GitHub Repository
1. Log in to [GitHub.com](https://github.com).
2. Click the **+** icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `rotating-content-slider`).
4. Ensure the repository is set to **Public**.
5. Do **not** initialize with a `.gitignore` or `README` (we already have them).
6. Click **Create repository**.

### Step 2: Push the Files to GitHub
Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: standalone rotating content slider"

# Set main branch
git branch -M main

# Link to your GitHub repository (replace with your URL)
git remote add origin https://github.com/<YOUR-USERNAME>/rotating-content-slider.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click on **Settings** (tab at the top).
3. In the left sidebar, click **Pages** (under "Code and automation").
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and folder `/ (root)`.
5. Click **Save**.
6. Wait 30–60 seconds. A banner will appear at the top:
   > *"Your site is live at `https://<YOUR-USERNAME>.github.io/rotating-content-slider/`"*

---

## 🎨 Asset Audit & Attribution

- **Hero & Background Imagery**: Downloaded directly from the original showcase server and converted into local assets in `./assets/images/`.
  - Kiwi Hero & Background (`kiwi-bowl.png`, `kiwi-bg.png`)
  - Blackberry Hero & Background (`blackberry-bowl.png`, `blackberry-bg.png`)
  - Banana Hero & Background (`banana-bowl.png`, `banana-bg.png`)
  - Strawberry Hero & Background (`strawberry-bowl.png`, `strawberry-bg.png`)
- **Icons**: Clean inline SVG icons based on standard Feather / Lucide icon specifications, eliminating external font file dependencies (`linearicons` and `themify`).
- **Dependencies**:
  - [GSAP 3.12.5](https://greensock.com/gsap/) via CDN for timeline transitions and easing.
  - [Google Fonts](https://fonts.google.com/) (`Playfair Display`, `DM Sans`, `Roboto`).
- **WordPress/Elementor Removal**:
  - Removed all `elementor-kit-143`, `wp-rocket`, `wp-emoji`, and PHP session scripts.
  - Retained semantic CSS variables and GSAP timeline logic.

---

## 📄 License
MIT License. Free for commercial and non-commercial educational use.
