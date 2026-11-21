
import { createClient } from "@supabase/supabase-js";
import { getSessionId } from "./session.js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        "x-session-id": getSessionId(),
      },
    },
  }
);
