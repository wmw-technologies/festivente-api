import { createClient } from '@supabase/supabase-js';

export default function getSupabase() {
    return createClient(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_KEY ?? '');
}
