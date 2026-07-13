# Meal Planner

Meal Planner is a web app for simplifying meals and grocery planning. The app is intended to help users:

- Plan meals for the week
- Track favorite recipes and ingredients
- Get AI-generated meal suggestions
- Help create shopping lists based on the week's planned meals

## Getting Started

Install dependencies:

```bash
npm install
```

To run the full development environment (Vite frontend + API functions):

```bash
npm run dev:full
```

To run the Vite frontend only (excludes API functions):

```bash
npm run dev:frontend
```

Duplicate the `.env.example` file and rename it to `.env`. Then fill in the required environment variables with your own values.

## User Onboarding

Sessions in this app are centered around the concept of "households" rather than individual user accounts. A unique UUID code is generated for each household and can be shared with other members - allowing users to collaborate on meal planning without needing to create accounts.

When launching the app, users are given a choice to either:

- Create a new household (generates a new UUID)
- Join an existing household (requires entering an existing UUID from another user or a shared link)

## Supabase

The app uses a Supabase Postgres database for storing meals, ingredients, weekly plans, and household data. You will need to set up a Supabase project and configure the following environment variables:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

## Gemini API

The meal generation functionality uses the Google Gemini API for AI-powered meal suggestions. You will need to set up an API key and configure it in your environment variables.

```
GOOGLE_GENAI_API_KEY=
```

See the official [Gemini API documentation](https://ai.google.dev/gemini-api/docs) for more details on how to obtain an API key and use the service.

## Vercel Serverless API Functions

This project uses Vercel serverless functions for the following backend logic:

- `/api/generate-meal` - Handles AI meal generation requests using Gemini

Each function is deployed independently by Vercel and runs on demand.

See the official [Vercel serverless functions documentation](https://vercel.com/docs/functions) for more details on how to create and manage these functions.

## Deployment

The app is designed to be deployed on Vercel.

Common deployment flow:

1. Push changes to the repository
2. Import or connect the project in Vercel
3. Configure any required environment variables (see `.env.example`)
4. Let Vercel build and deploy the app
