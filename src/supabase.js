import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://exvqmolcyernvcsreaor.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dnFtb2xjeWVybnZjc3JlYW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTc1NTksImV4cCI6MjA4NzE5MzU1OX0.y61G_8bhMFJ-QDb46Zb6TTMlbW8dPfY7MZE4XBQPorI' // Used the anon key retrieved earlier

export const supabase = createClient(supabaseUrl, supabaseKey)