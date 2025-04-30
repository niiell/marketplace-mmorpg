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

    // Cek role admin (misal: role disimpan di profiles atau user_metadata)
    const { data: profile } = await supabase.from('profiles').select('user_id, role').eq('user_id', user.id).single();
    if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cek status transaksi
    const { data: trx } = await supabase.from('transactions').select('id, status_order, buyer_id, seller_id').eq('id', transaction_id).single();
    if (!trx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    if (trx.status_order !== 'confirmed') return NextResponse.json({ error: 'Order not confirmed by buyer' }, { status: 400 });

    // Update status_order ke 'approved'
    await supabase.from('transactions').update({ status_order: 'approved', updated_at: new Date().toISOString() }).eq('id', transaction_id);

    // Send email notifications to buyer and seller
    const { data: buyer } = await supabase.from('profiles').select('email').eq('user_id', trx.buyer_id).single();
    const { data: seller } = await supabase.from('profiles').select('email').eq('user_id', trx.seller_id).single();

    if (buyer?.email) {
      await fetch('http://localhost:3000/api/notifications/send-transaction-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: buyer.email,
          subject: 'Transaksi Disetujui',
          message: `Transaksi dengan ID ${transaction_id} telah disetujui oleh admin.`,
        }),
      });
    }

    if (seller?.email) {
      await fetch('http://localhost:3000/api/notifications/send-transaction-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: seller.email,
          subject: 'Transaksi Disetujui',
          message: `Transaksi dengan ID ${transaction_id} telah disetujui oleh admin.`,
        }),
      });
    }

    // (Opsional) Tambah log
    // await supabase.from('transaction_logs').insert({ transaction_id, action: 'approved', performed_by: user.id });
    // (Opsional) Trigger payout ke penjual via Xendit (XenPlatform API)
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
