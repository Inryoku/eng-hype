import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type Rank = 0 | 1 | 2 | 3 | 4 | 5;
type RankMap = Record<string, number>;

export function useSentenceRanks(userId: string) {
  const [ranks, setRanks] = useState<RankMap>({});

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let cancelled = false;

    const fetchRanks = async () => {
      const { data, error } = await client
        .from("sentence_ranks")
        .select("content_hash, rank")
        .eq("user_id", userId);

      if (cancelled || error || !data) return;

      const loadedRanks: RankMap = {};
      data.forEach((row) => {
        loadedRanks[row.content_hash] = row.rank;
      });
      setRanks(loadedRanks);
    };

    void fetchRanks();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const saveRank = useCallback(
    async (hash: string, newRank: number) => {
      setRanks((prev) => ({ ...prev, [hash]: newRank }));

      const client = supabase;
      if (!client) return;

      const { error } = await client.from("sentence_ranks").upsert(
        {
          user_id: userId,
          content_hash: hash,
          rank: newRank,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, content_hash" },
      );

      if (error) {
        console.error("Failed to save rank:", error);
      }
    },
    [userId],
  );

  return { ranks, saveRank };
}
