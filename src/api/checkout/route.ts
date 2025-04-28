import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { listing_id, qty } = await req.json();
    if (!listing_id || !qty) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    // Cek user login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Ambil data listing
    const { data: listing } = await supabase.from('listings').select('id, price, seller_id, title').eq('id', listing_id).single();
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    // Hitung total
    const amount = Number(listing.price) * Number(qty);

    // Buat transaksi
    const { data: trx, error: trxError } = await supabase.from('transactions').insert({
      buyer_id: user.id,
      seller_id: listing.seller_id,
      listing_id,
      amount,
      status_order: 'pending',
      status_payment: 'unpaid',
    }).select().single();
    if (trxError) return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });

    // Panggil Xendit Payment Link API
    const xenditRes = await fetch('https://api.xendit.co/v2/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64'),
      },
      body: JSON.stringify({
        external_id: `trx-${trx.id}`,
        payer_email: user.email,
        description: `Pembelian ${listing.title}`,
        amount,
        success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/marketplace`,
      }),
    });
    const xenditData = await xenditRes.json();
    if (!xenditData.invoice_url) return NextResponse.json({ error: 'Xendit error', detail: xenditData }, { status: 500 });

    // Simpan payment_link_url ke transaksi
    await supabase.from('transactions').update({ payment_link_url: xenditData.invoice_url }).eq('id', trx.id);

    return NextResponse.json({ payment_link_url: xenditData.invoice_url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
