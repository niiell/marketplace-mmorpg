import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;

    let supabaseQuery = supabase.from('products').select('*');

    if (query) {
      supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
    }
    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }
    if (location) {
      supabaseQuery = supabaseQuery.eq('location', location);
    }
    if (priceMin !== undefined) {
      supabaseQuery = supabaseQuery.gte('price', priceMin);
    }
    if (priceMax !== undefined) {
      supabaseQuery = supabaseQuery.lte('price', priceMax);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
