// supabase/messages.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as supabaseMaybe } from './client';

export type MessageRow = {
  id?: string;
  session_id: string;
  name: string;
  message: string;
  created_at?: string;
};

const TABLE = 'messages';

// Centralized, strict runtime check so TS knows it's non-null afterwards.
function getSupabase(): SupabaseClient {
  if (!supabaseMaybe) {
    // Fail fast with an actionable error instead of silently doing nothing.
    throw new Error(
      'Supabase client is null. Check your supabase/client.ts config (URL/ANON KEY) and app environment variables.'
    );
  }
  return supabaseMaybe as SupabaseClient;
}

export async function insertMessage(row: MessageRow): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from(TABLE).insert(row);
  if (error) throw error;
}

export function subscribeToSessionMessages(
  sessionId: string,
  onRow: (row: MessageRow) => void
): { unsubscribe: () => void } {
  const supabase = getSupabase();

  const channel = supabase
    .channel(`messages:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: TABLE,
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        onRow(payload.new as MessageRow);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
