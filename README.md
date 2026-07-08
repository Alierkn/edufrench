# edufrench

French-curriculum learning platform for international students.

`edufrench` is a Next.js application for structured French practice, student
progress tracking, role-based access, and content-backed learning modules.

## Features

- Next.js app router with authenticated student and admin areas
- Prisma data model for users, modules, exercises, submissions, and progress
- NextAuth-based sessions with password support
- Sanity-backed content configuration
- Optional OpenAI and Resend integrations for evaluation and notifications
- Security headers configured in `next.config.ts`

## Tech Stack

- Next.js, React, TypeScript
- Prisma and PostgreSQL
- NextAuth
- Sanity
- Tailwind CSS

## Getting Started

```bash
npm ci
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Required for a full local run:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

Optional integrations:

- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `ADMIN_BOOTSTRAP_EMAIL`

See `.env.example` for placeholders and deployment notes.

## Scripts

```bash
npm run dev      # start local development
npm run lint     # run ESLint
npm run build    # generate Prisma client and build Next.js
npm run seed     # seed initial content/admin state
```

## Validation

CI installs dependencies with `npm ci`, runs linting, generates the Prisma
client against a dummy database URL, and builds the application.

## License

MIT. See [LICENSE](LICENSE).
