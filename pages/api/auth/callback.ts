import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider, code } = req.query;
  if (!provider || !code) {
    return res.status(400).json({ error: 'Missing provider or code' });
  }
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(String(code));
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    // Set cookie or session as needed, then redirect
    res.writeHead(302, { Location: '/dashboard' });
    res.end();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
