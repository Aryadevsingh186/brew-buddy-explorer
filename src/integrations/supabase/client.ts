// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ejrrbosdtwtissxqiczm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcnJib3NkdHd0aXNzeHFpY3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTE0MTIsImV4cCI6MjA1ODkyNzQxMn0.Z77sOaNN1KFjdJi4WIdZfajw2qs_y5vLXDYCsdy2B5E";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);