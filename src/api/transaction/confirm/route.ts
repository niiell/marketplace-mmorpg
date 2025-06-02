import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

import { csrfMiddleware } from '../../../middleware/csrf';

export async function POST(req: NextRequest) {
  // Run CSRF middleware first
  const csrfResponse = await csrfMiddleware(req);
  if (csrfResponse.status !== 200 && csrfResponse.status !== 204) {
    return csrfResponse;
  }

  try {
    const { transaction_id } = await req.json();
    if (!transaction_id) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    // Cek user login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Cek apakah user adalah buyer transaksi ini
    const { data: trx } = await supabase
      .from('transactions')
      .select('id, buyer_id, status_order, seller_id')
      .eq('id', transaction_id)
      .single();
    if (!trx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    if (trx.buyer_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (trx.status_order !== 'delivered') return NextResponse.json({ error: 'Order not delivered yet' }, { status: 400 });

    // Update status_order ke 'confirmed'
    await supabase
      .from('transactions')
      .update({ status_order: 'confirmed', updated_at: new Date().toISOString() })
      .eq('id', transaction_id);

    // Send email notification to seller
    const { data: seller } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', trx.seller_id)
      .single();

    if (seller?.email) {
      await fetch('http://localhost:3000/api/notifications/send-transaction-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: seller.email,
          subject: 'Pesanan Dikonfirmasi',
          message: `Pesanan dengan ID ${transaction_id} telah dikonfirmasi oleh pembeli.`,
        }),
      });
    }

    // Tambah log
    await supabase
      .from('transaction_logs')
      .insert({ transaction_id, action: 'confirmed', performed_by: user.id });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
