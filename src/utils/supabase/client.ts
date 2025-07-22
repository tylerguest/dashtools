export async function fetchUserWindowLayout(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_windows')
    .select('layout')
    .eq('user_id', userId)
    .single();
  if (error) {
    console.error('[Supabase] fetchUserWindowLayout error:', error);
  } else {
    console.log('[Supabase] fetchUserWindowLayout data:', data);
  }
  return { data, error };
}

export async function upsertUserWindowLayout(userId: string, layout: any) {
  const supabase = createClient();
  const result = await supabase
    .from('user_windows')
    .upsert([
      { user_id: userId, layout }
    ], { onConflict: 'user_id' });
  if (result.error) {
    console.error('[Supabase] upsertUserWindowLayout error:', result.error);
  } else {
    console.log('[Supabase] upsertUserWindowLayout success:', result.data);
  }
  return result;
}

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);

export async function saveCustomView(userId: string, name: string, layout: any) {
  const supabase = createClient();
  return await supabase.from('user_window_views').insert([
    { user_id: userId, name, layout }
  ]);
}

export async function fetchCustomViews(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_window_views')
    .select('id, name, layout')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function deleteCustomView(id: string, userId: string) {
  const supabase = createClient();
  return await supabase
    .from('user_window_views')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
}
