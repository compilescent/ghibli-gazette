# Ghibli Gazette 🍃

A modern, editorial anime news magazine for Studio Ghibli stories, anime releases, and film reviews.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Upstash Redis**.

---

## ✨ Features

- **Editorial Magazine Layout**: Featured hero story + side stack + breaking news ticker.
- **Categorized News Grid**: Filter articles by *Ghibli News*, *Reviews*, *New Releases*, *Premieres*, and *General*.
- **Full Article Reader**: Dedicated reading pages with breadcrumbs, reading time, view counter, and social sharing.
- **Admin Publishing Desk**: Password-protected editorial dashboard at `/admin` to write, edit, and publish stories.
- **Responsive Design**: Fast and optimized for mobile, tablet, and desktop with dark mode styling.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/compilescent/ghibli-gazette.git
cd ghibli-gazette
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Add your Redis / KV credentials to `.env.local`:
```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
ADMIN_PASSWORD=your_admin_password
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Access

To create and manage articles:
1. Navigate to `/admin`
2. Enter your admin password (set via `ADMIN_PASSWORD` in `.env.local`)
3. Write, format, and publish your stories

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & CSS Variables
- **Database**: Upstash Redis / Vercel KV
- **Deployment**: Vercel

---

## 📄 License

MIT License. Open source for anime fans and creators.
