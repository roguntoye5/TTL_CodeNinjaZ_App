import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  bio: string;
  avatar_url: string;
  instagram: string;
  email_public: string;
  gofundme_url: string;
  created_at: string;
};

export type Program = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export type UserProgram = {
  id: string;
  user_id: string;
  program_id: string;
  role: 'learner' | 'teacher';
  created_at: string;
  programs?: Program;
};

export type Interest = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};
