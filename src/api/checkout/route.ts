import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { transaction_id, amount, buyer_id } = await req.json();
    if (!transaction_id || !amount || !buyer_id) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    // Fetch transaction and listing
    const { data: trx, error: trxError } = await supabase
      .from('transactions')
      .select('id, listing_id')
      .eq('id', transaction_id)
      .single();
    if (trxError || !trx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    const { data: listing } = await supabase
      .from('listings')
      .select('title')
      .eq('id', trx.listing_id)
      .single();
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    // Fetch buyer email from Supabase Auth
    const { data: userList, error: userError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: `id=eq.${buyer_id}`
    });
    const payer_email = userList?.users?.[0]?.email;

    // Call Xendit API to create invoice
    const xenditRes = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64'),
      },
      body: JSON.stringify({
        external_id: `trx-${transaction_id}`,
        payer_email,
        description: `Pembelian ${listing.title}`,
        amount: Number(amount),
        success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/marketplace`,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/xendit/webhook`,
      }),
    });
    const xenditData = await xenditRes.json();
    if (!xenditData.invoice_url) return NextResponse.json({ error: 'Xendit error', detail: xenditData }, { status: 500 });

    // Save payment link to transaction
    await supabase.from('transactions').update({ payment_link_url: xenditData.invoice_url }).eq('id', transaction_id);

    return NextResponse.json({ payment_url: xenditData.invoice_url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
