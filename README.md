# Todoriko - Todo List Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

Before running the project, you need to set up the required environment variables.

1. Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in the environment variables in `.env.local` with your actual values. See `ENVIRONMENT_VARIABLES.md` for detailed instructions.

### Running the Development Server

First, install dependencies:
```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

This project requires several environment variables to function properly. Please see `ENVIRONMENT_VARIABLES.md` for detailed setup instructions.

## Features

- User authentication with Firebase
- Email verification
- Task management
- Responsive design with Tailwind CSS and DaisyUI

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important:** Make sure to set up all required environment variables in your Vercel project settings before deploying. See `ENVIRONMENT_VARIABLES.md` for details.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
