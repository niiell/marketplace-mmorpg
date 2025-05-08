import { redirect } from 'next/navigation';

/**
 * Enable dynamic imports for the Home page.
 */
export const dynamic = 'force-dynamic';

/**
 * The Home page component.
 *
 * Redirects to the landing page.
 */
export default function Home() {
  return redirect('/landing');
}