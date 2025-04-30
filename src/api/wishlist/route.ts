import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('wishlist')
    .select('listing_id')
    .eq('user_id', user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ wishlist: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id, listing_id } = body;

  if (!user_id || !listing_id) {
    return NextResponse.json({ error: 'Missing user_id or listing_id' }, { status: 400 });
  }

  // Check if already exists
  const { data: existing, error: fetchError } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', user_id)
    .eq('listing_id', listing_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ message: 'Already in wishlist' });
  }

  const { error } = await supabase
    .from('wishlist')
    .insert([{ user_id, listing_id }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Added to wishlist' });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  const listing_id = searchParams.get('listing_id');

  if (!user_id || !listing_id) {
    return NextResponse.json({ error: 'Missing user_id or listing_id' }, { status: 400 });
  }

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', user_id)
    .eq('listing_id', listing_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Removed from wishlist' });
}
