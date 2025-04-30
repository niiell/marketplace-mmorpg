import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { transaction_id } = await req.json();
    if (!transaction_id) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    // Cek user login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Cek apakah user adalah seller transaksi ini
    const { data: trx } = await supabase.from('transactions').select('id, seller_id, status_order, buyer_id').eq('id', transaction_id).single();
    if (!trx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    if (trx.seller_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (trx.status_order !== 'paid') return NextResponse.json({ error: 'Order not paid' }, { status: 400 });

    // Update status_order ke 'delivered'
    await supabase.from('transactions').update({ status_order: 'delivered', updated_at: new Date().toISOString() }).eq('id', transaction_id);

    // Send email notification to buyer
    const { data: buyer } = await supabase.from('profiles').select('email').eq('user_id', trx.buyer_id).single();

    if (buyer?.email) {
      await fetch('http://localhost:3000/api/notifications/send-transaction-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: buyer.email,
          subject: 'Pesanan Dikirim',
          message: `Pesanan dengan ID ${transaction_id} telah dikirim oleh penjual.`,
        }),
      });
    }

    // (Opsional) Tambah log
    // await supabase.from('transaction_logs').insert({ transaction_id, action: 'delivered', performed_by: user.id });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
