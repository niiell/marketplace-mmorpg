import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

const validateUserId = (user_id) => {
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }
  return null;
};

const validateListingId = (listing_id) => {
  if (!listing_id) {
    return NextResponse.json({ error: 'Missing listing_id' }, { status: 400 });
  }
  return null;
};

const validateWishlistItem = async (user_id, listing_id) => {
  const { data: existing, error: fetchError } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', user_id)
    .eq('listing_id', listing_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ message: 'Already in wishlist' });
  }
  return null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  const errorResponse = validateUserId(user_id);
  if (errorResponse) return errorResponse;

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
  const errorResponse = validateUserId(user_id) || validateListingId(listing_id);
  if (errorResponse) return errorResponse;

  const errorResponse2 = await validateWishlistItem(user_id, listing_id);
  if (errorResponse2) return errorResponse2;

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
  const errorResponse = validateUserId(user_id) || validateListingId(listing_id);
  if (errorResponse) return errorResponse;

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