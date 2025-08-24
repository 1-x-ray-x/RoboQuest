# RoboQuest - Learning Dashboard for Kids

A fun and engaging learning platform for kids to learn coding and robotics, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Interactive Dashboard** - Track learning progress with XP, levels, and streaks
- **Course Management** - Browse and enroll in coding and robotics courses
- **Tutorial Library** - Watch videos and follow interactive guides
- **Practice Projects** - Build real projects to practice skills
- **Progress Tracking** - Comprehensive analytics and learning insights
- **Achievement System** - Unlock badges and earn rewards
- **Kid-Friendly Interface** - Safe, engaging, and age-appropriate design

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager

## 🏗️ Installation & Setup

### 1. Create a new React project

```bash
# Create a new Vite + React + TypeScript project
npm create vite@latest roboquest --template react-ts
cd roboquest
```

### 2. Install dependencies

```bash
# Core dependencies
npm install react react-dom

# UI and styling dependencies
npm install tailwindcss@next @tailwindcss/typography
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install sonner@2.0.3

# Form handling
npm install react-hook-form@7.55.0

# Additional libraries for components
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog
npm install @radix-ui/react-aspect-ratio @radix-ui/react-avatar
npm install @radix-ui/react-checkbox @radix-ui/react-collapsible
npm install @radix-ui/react-context-menu @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu @radix-ui/react-hover-card
npm install @radix-ui/react-label @radix-ui/react-menubar
npm install @radix-ui/react-navigation-menu @radix-ui/react-popover
npm install @radix-ui/react-progress @radix-ui/react-radio-group
npm install @radix-ui/react-scroll-area @radix-ui/react-select
npm install @radix-ui/react-separator @radix-ui/react-sheet
npm install @radix-ui/react-slider @radix-ui/react-switch
npm install @radix-ui/react-tabs @radix-ui/react-toast
npm install @radix-ui/react-toggle @radix-ui/react-toggle-group
npm install @radix-ui/react-tooltip

# Development dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D typescript vite @vitejs/plugin-react
```

### 3. Copy the project files

Copy all the files from this project into your new project directory:

- Copy all files from `/components/` to `src/components/`
- Copy `/styles/globals.css` to `src/styles/globals.css`
- Copy `/App.tsx` to `src/App.tsx`
- Replace the contents of `src/main.tsx` with:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 4. Configure Tailwind CSS

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 5. Update package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

### 6. Run the development server

```bash
npm run dev
```

Your RoboQuest application should now be running at `http://localhost:5173`

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy React applications:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/roboquest.git
   git push -u origin main
   ```

2. **Deploy with Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a React project
   - Click "Deploy"

3. **Custom Domain** (Optional):
   - In your Vercel dashboard, go to your project settings
   - Add your custom domain under "Domains"

### Option 2: Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder to deploy instantly
   - Or connect your GitHub repository for automatic deployments

### Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install -D gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "homepage": "https://yourusername.github.io/roboquest",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Option 4: Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 Configuration

### Environment Variables

If you need to add environment variables (for APIs, etc.), create a `.env` file:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=RoboQuest
```

### Custom Domain Setup

For custom domains, follow your hosting provider's documentation:
- **Vercel**: Add domain in project settings
- **Netlify**: Add domain in site settings
- **Cloudflare Pages**: Configure DNS settings

## 📱 Mobile Responsiveness

The application is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Considerations

- All user data should be handled securely
- Implement proper authentication for production use
- Consider adding parental controls and safety features
- Follow COPPA compliance for children's applications

## 🐛 Troubleshooting

### Common Issues:

1. **Build fails**: Make sure all dependencies are installed correctly
2. **Images not loading**: Ensure image paths are correct and images are in the public folder
3. **Styling issues**: Verify Tailwind CSS is configured properly

### Getting Help:

- Check the browser console for errors
- Ensure all file paths are correct
- Verify all imports are using the correct casing

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🎉 Deployment Checklist

- [ ] All components are working locally
- [ ] Build process completes without errors
- [ ] Images and assets are properly configured
- [ ] Environment variables are set (if needed)
- [ ] Custom domain is configured (if desired)
- [ ] SSL certificate is active (automatic on most platforms)
- [ ] Performance is optimized

---

**Happy coding with RoboQuest! 🤖✨**