import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-callback-token") || "";
    if (signature !== process.env.XENDIT_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = await req.json();
    if (!event || !event.external_id || event.status !== "PAID") {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const trxId = event.external_id.replace("trx-", "");
    const { data: trx, error: trxError } = await supabase
      .from("transactions")
      .select("seller_id")
      .eq("id", trxId)
      .single();

    if (trxError || !trx || !trx.seller_id) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    await supabase
      .from("transactions")
      .update({ status_order: "PAID", status_payment: "PAID" })
      .eq("id", trxId);

    await supabase.from("notifications").insert({
      user_id: trx.seller_id,
      type: "payment",
      content: "Pembayaran diterima, silakan proses pesanan.",
      url_target: "/dashboard"
    });

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}