# DevVista Dashboard

A beautiful, production-ready GitHub analytics dashboard built with React, Vite, and Recharts.

![Gitlytics Dashboard](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue?logo=tailwindcss)

## Features

- **Repository Overview** - View stars, forks, watchers, and open issues
- **Commit Activity** - Line chart showing weekly commit patterns (last 12 weeks)
- **Contributors Breakdown** - Bar chart displaying top contributors by commit count
- **Pull Requests Status** - Pie chart showing open/merged/closed PR distribution
- **Issues Timeline** - Area chart tracking issue creation and resolution
- **Real-time Search** - Enter any GitHub username to explore their repositories
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Beautiful Dark Theme** - Developer-focused aesthetic with glassmorphism effects

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Composable charting library
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **shadcn/ui** - Beautiful UI components

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── CommitActivityChart.tsx
│   │   ├── ContributorsChart.tsx
│   │   ├── IssuesChart.tsx
│   │   └── PullRequestsChart.tsx
│   ├── ChartCard.tsx
│   ├── ErrorState.tsx
│   ├── Loader.tsx
│   ├── Navbar.tsx
│   ├── RepoCard.tsx
│   ├── SearchBar.tsx
│   └── UserProfile.tsx
├── pages/
│   ├── Home.tsx
│   ├── Index.tsx
│   ├── NotFound.tsx
│   └── RepoDetails.tsx
├── services/
│   └── githubApi.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AtharvCodeCraft/DevVista.git
   cd gitlytics-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

## API Usage

The app uses the GitHub REST API v3 (unauthenticated). Rate limits apply:
- **Unauthenticated**: 60 requests/hour per IP
- **Authenticated**: 5,000 requests/hour (requires token)

To increase rate limits, you can add a GitHub Personal Access Token:

1. Generate a token at https://github.com/settings/tokens
2. Add it to the API headers in `src/services/githubApi.ts`:
   ```typescript
   const api = axios.create({
     baseURL: BASE_URL,
     headers: {
       Accept: "application/vnd.github.v3+json",
       Authorization: "token YOUR_TOKEN_HERE",
     },
   });
   ```

## Building for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## Deployment (Vercel)

### Option 1: Via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure build settings:
    - **Framework Preset**: Vite
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
6. Click "Deploy"

### Option 2: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. For production deployment:
   ```bash
   vercel --prod
   ```

## Environment Variables

No environment variables are required for basic functionality. Optional:

| Variable | Description |
|----------|-------------|
| `VITE_GITHUB_TOKEN` | GitHub Personal Access Token for higher rate limits |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.
=======
# Gitlytics
Gitlytics Dashboard is a React-based analytics tool that visualizes GitHub repository metrics through interactive charts, offering insights into commits, contributors, issues, and pull requests.
