import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpbznlvnlgeldcrisyzh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwYnpubHZubGdlbGRjcmlzeXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDg3NDgsImV4cCI6MjA2MzMyNDc0OH0.Tp28LACDO2rcge7QNZZWfmQV4Fzvc4x9PYPuzq8F6HI';

export const supabase = createClient(supabaseUrl, supabaseKey);