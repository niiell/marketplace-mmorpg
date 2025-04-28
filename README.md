# 📋 GitHub Copilot Prompts untuk Marketplace MMORPG (Ultra Detail)

Dokumen ini memuat **prompt perintah** yang bisa kamu masukkan persis ke GitHub Copilot Agent di VS Code. Setiap prompt disusun untuk menghasilkan file, konfigurasi, atau feature tertentu dengan detail lengkap: nama file, path, kode boilerplate, dan komentar.

---

## 1. Inisialisasi Project & Setup Config Dasar

**Prompt Copilot:**
```plaintext
// > Initialize Next.js + TypeScript + Tailwind + Contentlayer
Generate a new Next.js project with TypeScript support and ESLint configuration. Install and configure Tailwind CSS and Contentlayer. Create the following files:

// 1. tailwind.config.js
// 2. postcss.config.js
// 3. contentlayer.config.ts
// 4. next.config.js

Include placeholders for environment variables SUPABASE_URL and SUPABASE_ANON_KEY. Provide comments in each config file explaining purpose of sections.
```

**Hasil yang diharapkan:**
- Generation command di terminal.
- File `tailwind.config.js` dengan proper `content` paths.
- File `postcss.config.js` default Tailwind.
- File `contentlayer.config.ts` definisi document type `Post`.
- `next.config.js` mengimpor `withContentlayer` dan setup env.

---

## 2. Folder Struktur & Boilerplate File

**Prompt Copilot:**
```plaintext
// > Create folder structure and basic files
In the project root, create directories: components, pages, public/assets, lib, hooks, styles, utils, context, api, content.
Under pages, create _app.tsx and index.tsx with basic React imports and Tailwind CSS import.
Under lib, create supabaseClient.ts with createClient code. Include comments for env variables.
Under components, create Hero.tsx with GSAP animation example.
Provide path comments at top of each file.
```

---

## 3. Landing Page with GSAP & SEO

**Prompt Copilot:**
```plaintext
// > Landing Page SSG + SEO
Create file pages/index.tsx:
- Import Hero component.
- Fetch blog posts from Contentlayer.
- Render Hero, Features section (3 cards), Testimonials section, and Footer.
- Use GSAP for animating Hero text fade-in on mount.
- Add <NextSeo> component with title "Marketplace MMORPG SEA" and description.
- Insert JSON-LD script for Organization schema in head.
```

---

## 4. Autentikasi Supabase & Zod Validation

**Prompt Copilot:**
```plaintext
// > Auth pages and API routes
Generate pages/auth/register.tsx and pages/auth/login.tsx:
- Use React Hook Form and Zod for input schema.
- Form fields: email, password, confirmPassword (register).
- Show validation errors inline.
- On submit, call supabase.auth.signUp or signIn.
- After successful auth, redirect to /dashboard.

Under pages/api, create api/auth/callback.ts to handle OAuth provider (Google) callback via Supabase.
```

---

## 5. Migration SQL untuk Supabase Tables

**Prompt Copilot:**
```plaintext
// > Create SQL migration script
In a file migrations/001_initial.sql write:
- CREATE TABLE users (...);
- CREATE TABLE profiles (...);
- CREATE TABLE listings (...);
- CREATE TABLE transactions (...);
- CREATE TABLE transaction_logs (...);
- CREATE TABLE chats (...);
- CREATE TABLE messages (...);
- CREATE TABLE reviews (...);
- CREATE TABLE notifications (...);
- CREATE TABLE categories (...);
- CREATE TABLE games (...);
- CREATE TABLE cms_posts (...);

After each CREATE TABLE, add COMMENT ON statements explaining columns.

Also add RLS policy statements: ENABLE ROW LEVEL SECURITY; CREATE POLICY "Users can manage own profiles" FOR SELECT/INSERT/UPDATE/DELETE USING (auth.uid() = user_id);
```

---

## 6. Halaman Marketplace Browse & Detail

**Prompt Copilot:**
```plaintext
// > Marketplace UI
Create pages/marketplace/index.tsx:
- Fetch listings via supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(20).
- Add search input bound to state, filter call.
- Map results to <ListingCard /> components under components/ListingCard.tsx.
- ListingCard: show image, title, price formatted with Intl.NumberFormat.

Create pages/marketplace/[id].tsx:
- Use getStaticPaths + getStaticProps for SSG of popular listings.
- Fetch listing details and reviews.
- Render gallery (components/Gallery.tsx), description, seller info, <ChatButton /> and <BuyButton />.
```

---

## 7. Form Upload Listing Baru

**Prompt Copilot:**
```plaintext
// > Upload listing form
Under pages/marketplace/create.tsx generate:
- React Hook Form with Zod schema: title, description, price (number), stock (number), category_id, game_id, images (array of files).
- On image select, upload to supabase.storage.from('listings').upload and track progress.
- After upload, insert record into listings table with image URLs.
- Show Toast notifications for success or error.
```

---

## 8. Chat Real-Time dengan Supabase Realtime

**Prompt Copilot:**
```plaintext
// > Chat component
In components/ChatRoom.tsx:
- Accept props chatId and currentUserId.
- Subscribe to supabase.from(`messages:chat_id=eq.${chatId}`).on('INSERT', payload => append message).
- Provide input box, send button; on send call supabase.from('messages').insert({ chat_id: chatId, sender_id: currentUserId, content }).
- Use react-virtualized for list performance.
- Show unread badge count via supabase.from(`messages:chat_id=eq.${chatId}`).select('count', { head: true }).neq('sender_id', currentUserId).
```

---

## 9. Checkout & Escrow via Xendit

**Prompt Copilot:**
```plaintext
// > Xendit integration
Create pages/checkout/[listingId].tsx:
- Create transaction: await supabase.from('transactions').insert({ listing_id, buyer_id: user.id, status: 'PENDING' }).select('id').single();
- Call Xendit API to create invoice/payment link with callback URL /api/webhooks/xendit.
- Redirect user to payment URL.

Under pages/api/webhooks/xendit.ts:
- Receive Xendit webhook events, verify signature.
- On payment success, update transaction status to 'PAID'.
- Emit Supabase realtime notification to seller.
```

---

## 10. Dashboard User & Admin

**Prompt Copilot:**
```plaintext
// > Dashboards
Generate pages/dashboard/index.tsx for user:
- Show tabs: Listings, Orders, Profile.
- Fetch relevant data via supabase.

Generate pages/dashboard/admin.tsx for admin:
- Show pending transactions table with approve/reject buttons.
- On approve, update supabase.from('transactions').update({ status: 'APPROVED' }).
- Provide user management list with ban/unban actions.
```

---

## 11. Rating & Review System

**Prompt Copilot:**
```plaintext
// > Reviews
In components/ReviewForm.tsx:
- Form with React Hook Form: rating (1–5), comment.
- On submit, insert into reviews table.

In pages/marketplace/[id].tsx, below product info:
- Fetch reviews: supabase.from('reviews').select('*').eq('listing_id', id).
- Map to <ReviewCard />.
- Display average rating with star icons.
```

---

## 12. Notifikasi In-App

**Prompt Copilot:**
```plaintext
// > Notifications component
Create components/Notifications.tsx:
- Subscribe to supabase.from(`notifications:user_id=eq.${currentUserId}`).on('INSERT', payload => add to state).
- Show bell icon with badge unread count.
- On click, show dropdown list of notifications with link to target URL.
- On click notification, call supabase.from('notifications').update({ is_read: true }).eq('id', notif.id).
```

---

## 13. Internationalization (i18n) & Format Currency

**Prompt Copilot:**
```plaintext
// > i18n setup
Configure next.config.js i18n: locales ['en', 'id', 'th'], default 'id'.
Install next-intl and generate /locales/en.json, id.json, th.json with translation keys: 'home.title', 'auth.login', etc.
Wrap _app.tsx with IntlProvider.

// > Currency util
tools/formatCurrency.ts:
export function formatCurrency(value: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
```

---

## 14. PWA & Offline Support

**Prompt Copilot:**
```plaintext
// > PWA configuration
Install next-pwa and configure next.config.js with pwa: { dest: 'public', runtimeCaching }
Create public/manifest.json with app name, icons, theme_color.
Add _document.tsx head tags for manifest and meta theme-color.
```

---

## 15. Testing: Unit & E2E

**Prompt Copilot:**
```plaintext
// > Testing setup
Install Jest, React Testing Library, Cypress.
Create jest.config.js and sample test in __tests__/Hero.test.tsx: render Hero and assert text.
Setup cypress.json and write test: visiting home, performing auth, checking marketplace listing appears.
```

---

## 16. Performance, Monitoring & Accessibility

**Prompt Copilot:**
```plaintext
// > Monitoring and accessibility
Install Sentry and configure in pages/_app.tsx with SENTRY_DSN.
Add React axe in development.
Configure Lighthouse CI in GitHub Actions.

// > Accessibility checks
tooling/precommit hook to run axe-core on rendered pages snapshot.
```

---

## 17. CI/CD Pipeline

**Prompt Copilot:**
```plaintext
// > GitHub Actions workflow
Create .github/workflows/ci.yml:
- Run actions/checkout, setup Node.
- Install, run lint, run tests.
Create deploy.yml to run build and deploy to Vercel with vercel-action.
```

---

## 18. Dokumentasi & Handoff

**Prompt Copilot:**
```plaintext
// > Documentation
Update README.md:
- Project overview, setup steps, folder structure.
- Environment variables list.
- Deployment instructions.
- Testing and contribution guidelines.

Generate API spec openapi.yaml in .github/api-spec with endpoints for auth, listings, transactions, webhooks.
```

---

> 🎯 **Gunakan prompt ini** satu per satu di Copilot Chat. Salin seluruh blok `plaintext` untuk hasil maksimal. Cek output dan sesuaikan jika perlu. Good luck!
