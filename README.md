# Elizer Soldevilla - Portfolio Website

A modern, performant portfolio website built with **Astro 4**, **Tailwind CSS**, and **TypeScript**. Deployed on GitHub Pages.

## ✨ Features

- **⚡ Lightning Fast** - Static site generation with Astro for optimal performance
- **🎨 Modern Design** - Clean, responsive UI with dark mode support
- **📱 Fully Responsive** - Works beautifully on all devices
- **🔍 SEO Optimized** - Meta tags, Open Graph, JSON-LD structured data, sitemap
- **♿ Accessible** - Semantic HTML, ARIA labels, keyboard navigation
- **🌙 Dark Mode** - System preference detection with manual toggle
- **📊 Project Showcase** - Detailed project pages with galleries, tech stacks, outcomes
- **📝 Content Collections** - Type-safe content management with Astro Content Collections
- **🚀 CI/CD** - Automated deployment via GitHub Actions

## 🛠 Tech Stack

- **Framework**: [Astro 4](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [GitHub Pages](https://pages.github.com/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)
- **Fonts**: Inter & Poppins (Google Fonts)
- **Icons**: Inline SVG

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.astro     # Navigation header with mobile menu
│   ├── Footer.astro     # Site footer
│   ├── Hero.astro       # Hero section with typed animation
│   ├── About.astro      # About section
│   ├── Skills.astro     # Skills with animated progress bars
│   ├── Resume.astro     # Experience & education timeline
│   ├── Portfolio.astro  # Project grid with filters
│   ├── Contact.astro    # Contact form & info
│   ├── RelatedProjects.astro
│   └── ThemeToggle.astro
├── content/             # Content collections (type-safe)
│   ├── projects/        # Project markdown files
│   ├── experience/      # Work experience markdown files
│   └── config.ts        # Collection schemas
├── layouts/
│   └── Layout.astro     # Main layout with SEO
├── pages/
│   ├── index.astro      # Homepage
│   └── project/[slug].astro  # Dynamic project detail pages
├── styles/
│   └── global.css       # Global styles & Tailwind imports
├── utils/               # Utility functions
└── env.d.ts             # TypeScript declarations

public/
├── images/              # Static images
├── robots.txt           # SEO robots file
├── site.webmanifest     # PWA manifest
└── assets/              # PDFs, downloads

.github/workflows/
└── deploy.yml           # GitHub Actions deployment
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/elizersoldevilla/elizerporfolio.io.git
cd elizer-portfolio-new

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see the site.

### Available Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run format    # Format with Prettier
npm run lint      # Run ESLint
npm run astro     # Run Astro CLI commands
```

## 📦 Deployment

### GitHub Pages (Automatic)

1. Push to `main` branch
2. GitHub Actions will automatically build and deploy
3. Site will be available at `https://elizersoldevilla.github.io/elizerporfolio.io/`

### Manual Deployment

```bash
npm run build
# Deploy the `dist/` folder to your hosting provider
```

## 🎨 Customization

### Colors

Edit `tailwind.config.mjs` to customize the color palette:

```js
colors: {
  primary: {
    500: '#149ddd',  // Main brand color
    // ... other shades
  }
}
```

### Content

Add/modify projects in `src/content/projects/` as Markdown files with frontmatter:

```markdown
---
title: "Project Name"
description: "Short description"
longDescription: "Detailed description"
image: "/images/portfolio/project-image.png"
category: "web"  // web | system | mobile | seminar | other
technologies: ["PHP", "Laravel", "Vue.js"]
featured: true
projectUrl: "https://example.com"
githubUrl: "https://github.com/username/repo"
startDate: "2024-01-01"
endDate: "2024-06-30"
highlights: ["Key achievement 1", "Key achievement 2"]
challenges: ["Challenge 1", "Challenge 2"]
outcomes: ["Result 1", "Result 2"]
---
```

### Experience

Add work experience in `src/content/experience/`:

```markdown
---
title: "Job Title"
company: "Company Name"
location: "City, Country"
startDate: "2023-01-01"
endDate: "2024-12-31"
current: false
description: "Role description"
achievements: ["Achievement 1", "Achievement 2"]
technologies: ["Tech 1", "Tech 2"]
type: "full-time"  // full-time | part-time | internship | freelance | volunteer
---
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Elizer Soldevilla**
- GitHub: [@elizersoldevilla](https://github.com/elizersoldevilla)
- LinkedIn: [elizersoldevilla](https://linkedin.com/in/elizersoldevilla)
- Twitter: [@Ejbike2](https://twitter.com/Ejbike2)
- Email: elizersoldevilla123@gmail.com

---

Built with ❤️ using Astro & Tailwind CSS