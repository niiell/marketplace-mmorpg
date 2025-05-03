# Marketplace MMORPG SEA

## Project Overview
Marketplace MMORPG SEA is a platform for buying and selling in-game items, gold, and services for MMORPGs in Southeast Asia. It features real-time chat, escrow payments, user reviews, and admin moderation. Built with Next.js, Tailwind CSS, Supabase, and Xendit for payments.

## Features
- Real-time chat between buyers and sellers
- Secure escrow payment system via Xendit
- User reviews and ratings
- Multi-language support (EN, ID, TH, PH)
- Admin dashboard for moderation
- Responsive PWA design
- Accessibility compliance with axe-core

## Tech Stack
- **Frontend**: Next.js 13+, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payment**: Xendit
- **Monitoring**: Sentry
- **Testing**: Jest, React Testing Library, Cypress
- **CI/CD**: GitHub Actions, Vercel

## Setup Steps
1. Clone the repository and install dependencies:
   ```sh
   git clone <repo-url>
   cd marketplace-mmorpg
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in required environment variables (see below).
3. Set up Supabase:
   ```sh
   # Install Supabase CLI if needed
   npm install supabase --save-dev
   
   # Initialize database
   supabase init
   supabase start
   
   # Run migrations
   supabase db reset
   
   # Alternatively, run the SQL script manually:
   psql -d your_database -f supabase-init.sql
   ```
4. Run local development:
   ```sh
   npm run dev
   ```
5. Prepare Husky hooks:
   ```sh
   npm run prepare
   ```

## Environment Variables
Required variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous API key
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking DSN
- `XENDIT_API_KEY` - Xendit secret API key
- `XENDIT_WEBHOOK_SECRET` - Webhook verification token
- `NEXT_PUBLIC_SITE_URL` - Site URL (e.g. http://localhost:3000)

For deployment:
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Organization ID
- `VERCEL_PROJECT_ID` - Project ID

## Project Structure
```
├── src/                    # Main application code
│   ├── app/               # Next.js 13 app directory
│   ├── components/        # Reusable React components
│   ├── lib/              # Utility libraries and clients
│   └── api/              # API route handlers
├── public/               # Static assets
├── styles/              # Global styles
├── locales/             # i18n translations
├── tools/               # Development utilities
├── __tests__/          # Jest test files
└── cypress/            # E2E test files
```

## Development Workflow
1. Create feature branch from `main`
2. Make changes and ensure tests pass:
   ```sh
   npm run test        # Unit tests
   npm run cypress     # E2E tests
   npm run lint        # ESLint
   npm run typecheck   # TypeScript
   ```
3. Submit PR with description of changes
4. Wait for CI checks and review
5. Merge to main after approval

## Testing & Quality Assurance
- **Unit Tests**: `npm test` - Jest and React Testing Library
- **E2E Tests**: `npm run cypress` - Cypress for integration tests
- **Type Checking**: `npm run typecheck` - TypeScript validation
- **Linting**: `npm run lint` - ESLint with Next.js config
- **Accessibility**: 
  - Pre-commit hook runs axe-core
  - Lighthouse CI in GitHub Actions
  - WCAG 2.1 compliance checks

## Deployment
1. Automatic deployment to Vercel on push to `main`
2. Manual deployment if needed:
   ```sh
   npm run build
   vercel deploy
   ```
3. Set required environment variables in Vercel dashboard
4. Configure Supabase database policies
5. Set up Xendit webhook endpoints

**Note:** The `supabase-init.sql` script in the root directory contains the database schema and policies. Currently, it is not integrated into the CI/CD deployment workflow. Consider adding a step in your deployment pipeline to run this script or manage migrations accordingly.

## API Documentation
REST API endpoints are documented in OpenAPI specification at `.github/api-spec/openapi.yaml`.

Main endpoints:
- Auth: `/api/auth/*` - Registration, login
- Listings: `/api/listings/*` - CRUD operations
- Transactions: `/api/transaction/*` - Order processing
- Webhooks: `/api/xendit/webhook` - Payment notifications

## Contributing
1. Fork the repository
2. Create feature branch
3. Follow code style and testing guidelines
4. Submit PR with clear description
5. Include tests for new features

## License
MIT License - see LICENSE file for details

## Support
- GitHub Issues for bug reports
- Discussions for feature requests
- Security issues: contact maintainers directly
