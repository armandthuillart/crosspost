# Crosspost

This is my second web app. I built it for fun, to learn how to make a ChatGPT-like app from scratch.

## What it does

Crosspost is an AI chat where you describe what you want to post. The AI writes it for you, adapted to each platform.

When you chat with AI, it:
- Reads your message
- Writes a version for Mastodon, LinkedIn, Bluesky, Threads, and X
- Adjusts the tone for each platform

## Features

- [x] AI writes posts for 5 platforms at once
- [x] Each platform gets its own format
- [x] Works in English and French
- [x] Sign in with Google
- [x] Pro version with unlimited chats (via Polar)
- [x] Free users have rate limits
- [x] Past chats are saved and searchable
- [x] Rich text editor for editing posts

## Tech stack

- Next.js 16
- Convex
- Better Auth
- Claude 4.5 Haiku
- Lexical
- Tailwind CSS
- Bun

## Running the app

**Prerequisites**
- Node.js 18+
- Bun
- API keys: Convex, Google, Polar (optional)

**Setup**

```bash
git clone https://github.com/thuillart/crosspost.git
cd crosspost
bun install
cp .env.example .env
# Fill in your API keys in .env
bun run dev
```

Open `http://localhost:3000`

## Project structure

```
├── app/               # Next.js pages
├── components/        # UI components
├── convex/           # Backend code
├── content/docs/     # Legal pages
├── lib/              # Helper functions
└── messages/         # Translations
```