# Sushovan Kc - Portfolio

Personal portfolio website showcasing my work as an AI & Machine Learning Engineer.

## 🚀 Live Demo

[View Portfolio](#) <!-- Add your live URL here -->

## 📁 Project Structure

```
new_portfolio/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Stylesheet
├── js/
│   └── script.js           # JavaScript functionality
├── assets/
│   └── images/             # Image assets
│       ├── profile/        # Profile photos
│       ├── projects/       # Project screenshots
│       └── icons/          # Custom icons
└── README.md               # This file
```

## ✨ Features

- 🌙 Light/Dark theme toggle with system preference detection
- 🎨 Modern greenish light theme with clean design
- 📱 Fully responsive design
- 🎯 Interactive particle background
- ⚡ Smooth animations and transitions
- 🔧 Easy to customize

## 🛠️ Technologies

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript
- Google Fonts (Inter, Playfair Display)

## 📷 Adding Images

1. Place your images in the appropriate folder:
   - Profile photos → `assets/images/profile/`
   - Project screenshots → `assets/images/projects/`
   - Icons → `assets/images/icons/`

2. Reference them in HTML:
   ```html
   <img src="assets/images/projects/project-name.jpg" alt="Project Name">
   ```

## 🚀 Deployment to GitHub Pages

1. Create a new repository on GitHub
2. Initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Sushovan-kc/portfolio.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Select "main" branch and save
5. Your site will be live at `https://sushovan-kc.github.io/portfolio/`

## 📝 Customization

### Change Theme Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --bg-primary: #e8f5e9;      /* Main background */
    --accent-primary: #2e7d32;   /* Accent color */
    /* ... */
}
```

### Update Content
Edit `index.html` to update:
- Personal information
- Skills
- Projects
- Contact details

## 📄 License

© 2026 Sushovan Kc. All rights reserved.
