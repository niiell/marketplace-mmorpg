import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { transaction_id } = await req.json();
    if (!transaction_id) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    // Check user login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check admin role
    const { data: profile } = await supabase.from('profiles').select('user_id, role').eq('user_id', user.id).single();
    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check transaction status
    const { data: trx } = await supabase.from('transactions').select('id, status_order, buyer_id, seller_id').eq('id', transaction_id).single();
    if (!trx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    if (trx.status_order !== 'confirmed') return NextResponse.json({ error: 'Order not confirmed by buyer' }, { status: 400 });

    // Update transaction status
    await supabase.from('transactions').update({ status_order: 'approved', updated_at: new Date().toISOString() }).eq('id', transaction_id);

    // Send email notifications to buyer and seller
    const { data: buyer } = await supabase.from('profiles').select('email').eq('user_id', trx.buyer_id).single();
    const { data: seller } = await supabase.from('profiles').select('email').eq('user_id', trx.seller_id).single();

    const sendEmail = async (email: string, subject: string, message: string) => {
      await fetch('http://localhost:3000/api/notifications/send-transaction-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message }),
      });
    };

    if (buyer?.email) {
      await sendEmail(buyer.email, 'Transaksi Disetujui', `Transaksi dengan ID ${transaction_id} telah disetujui oleh admin.`);
    }

    if (seller?.email) {
      await sendEmail(seller.email, 'Transaksi Disetujui', `Transaksi dengan ID ${transaction_id} telah disetujui oleh admin.`);
    }

    // (Optional) Add log
    // await supabase.from('transaction_logs').insert({ transaction_id, action: 'approved', performed_by: user.id });
    // (Optional) Trigger payout to seller via Xendit (XenPlatform API)
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}