
-- 1. Support Tickets
CREATE TABLE IF NOT EXISTS public.tickets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  user_email TEXT,
  message TEXT,
  intent TEXT,
  urgency TEXT,
  status TEXT DEFAULT 'Open'
);

-- 2. Chat Logs
CREATE TABLE IF NOT EXISTS public.chat_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  message TEXT,
  reply TEXT,
  intent TEXT,
  urgency TEXT,
  escalated BOOLEAN,
  ticket_id BIGINT REFERENCES public.tickets(id)
);

-- 3. Admin Users
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
