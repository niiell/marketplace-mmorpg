import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getDisputes = async () => {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

const updateDispute = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('disputes')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export async function GET(req: NextRequest) {
  try {
    const disputes = await getDisputes();
    return NextResponse.json({ disputes });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dispute = await updateDispute(id, status);
    return NextResponse.json({ dispute });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}