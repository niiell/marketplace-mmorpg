import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Optional: Verifikasi signature Xendit di sini
    const { external_id, status } = body;
    if (!external_id || !status) return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
    if (!external_id.startsWith('trx-')) return NextResponse.json({ error: 'Not a transaction' }, { status: 400 });
    const trxId = external_id.replace('trx-', '');

    if (status === 'PAID') {
      // Update transaksi ke paid
      await supabase.from('transactions').update({
        status_payment: 'paid',
        status_order: 'paid',
        updated_at: new Date().toISOString(),
      }).eq('id', trxId);
      // (Opsional) Tambah log transaksi
      // await supabase.from('transaction_logs').insert({ transaction_id: trxId, action: 'payment_paid', note: 'Xendit webhook' });
    }
    // Bisa handle status lain (EXPIRED, FAILED, dsb) jika perlu
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
