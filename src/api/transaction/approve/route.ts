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
    const { data: trx } = await supabase.from('transactions').select('id, status_order').eq('id', transaction_id).single();
    if (!trx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    if (trx.status_order !== 'confirmed') return NextResponse.json({ error: 'Order not confirmed by buyer' }, { status: 400 });

    // Update status_order ke 'approved'
    await supabase.from('transactions').update({ status_order: 'approved', updated_at: new Date().toISOString() }).eq('id', transaction_id);
    // (Opsional) Tambah log
    // await supabase.from('transaction_logs').insert({ transaction_id, action: 'approved', performed_by: user.id });
    // (Opsional) Trigger payout ke penjual via Xendit (XenPlatform API)
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
