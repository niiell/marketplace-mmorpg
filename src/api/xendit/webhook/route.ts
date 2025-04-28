import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Xendit signature verification (simple token header, adjust as needed)
  const signature = req.headers.get("x-callback-token") || "";
  if (signature !== process.env.XENDIT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = await req.json();
  if (event.status === "PAID" && event.external_id) {
    const trxId = event.external_id.replace("trx-", "");
    // Update transaction status
    await supabase
      .from("transactions")
      .update({ status_order: "PAID", status_payment: "PAID" })
      .eq("id", trxId);
    // Get transaction to find seller_id
    const { data: trx } = await supabase
      .from("transactions")
      .select("seller_id")
      .eq("id", trxId)
      .single();
    if (trx && trx.seller_id) {
      // Insert notification for seller
      await supabase.from("notifications").insert({
        user_id: trx.seller_id,
        type: "payment",
        content: "Pembayaran diterima, silakan proses pesanan.",
        url_target: "/dashboard"
      });
    }
  }
  return NextResponse.json({ received: true });
}
