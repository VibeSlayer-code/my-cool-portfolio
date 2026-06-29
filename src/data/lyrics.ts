import type { Track } from "./tracks";

export type LyricLine = { time: number; text: string };

const TIMESTAMP = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;

export const parseLrc = (lrc: string): LyricLine[] => {
  const lines: LyricLine[] = [];

  for (const raw of lrc.split("\n")) {
    const stamps = [...raw.matchAll(TIMESTAMP)];
    if (!stamps.length) continue;

    const text = raw.replace(TIMESTAMP, "").trim();
    for (const m of stamps) {
      const min = Number(m[1]);
      const sec = Number(m[2]);
      const frac = m[3] ? Number(`0.${m[3]}`) : 0;
      lines.push({ time: min * 60 + sec + frac, text });
    }
  }

  return lines.sort((a, b) => a.time - b.time);
};

type LrclibHit = {
  syncedLyrics?: string | null;
  duration?: number | null;
};

const pickBest = (hits: LrclibHit[], durationHint?: number): LrclibHit | undefined => {
  const synced = hits.filter((h) => h.syncedLyrics && h.syncedLyrics.trim());
  if (!synced.length) return undefined;
  if (!durationHint || durationHint <= 0) return synced[0];

  return synced.reduce((best, h) =>
    Math.abs((h.duration ?? 0) - durationHint) < Math.abs((best.duration ?? 0) - durationHint) ? h : best,
  );
};

export const fetchSyncedLyrics = async (
  track: Track,
  durationHint?: number,
  signal?: AbortSignal,
): Promise<LyricLine[] | null> => {
  const primaryArtist = track.artist.split(/[,&]/)[0].trim();

  const endpoints = [
    `https://lrclib.net/api/search?track_name=${encodeURIComponent(track.title)}&artist_name=${encodeURIComponent(primaryArtist)}`,
    `https://lrclib.net/api/search?q=${encodeURIComponent(`${track.title} ${primaryArtist}`)}`,
  ];

  const results = await Promise.allSettled(
    endpoints.map(async (url) => {
      const res = await fetch(url, { signal });
      if (!res.ok) return null;
      const data: unknown = await res.json();
      if (!Array.isArray(data)) return null;

      const best = pickBest(data as LrclibHit[], durationHint);
      if (!best?.syncedLyrics) return null;

      const lines = parseLrc(best.syncedLyrics);
      return lines.length ? lines : null;
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value?.length) return result.value;
    if (result.status === "rejected" && (result.reason as Error).name === "AbortError") return null;
  }

  return null;
};
