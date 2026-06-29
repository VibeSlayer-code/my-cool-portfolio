import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiMusic, FiPause, FiPlay, FiSkipBack, FiSkipForward } from "react-icons/fi";
import { fetchSyncedLyrics, type LyricLine } from "../data/lyrics";
import { thumbnailFor, tracks } from "../data/tracks";

const loadYouTubeApi = () =>
  new Promise<void>((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });

const VOLUME = 70;
const LYRIC_VISUAL_SYNC_OFFSET = 0.16;
const DANCER_GIF = "https://gifer.com/i/Paw.gif";
type LyricsStatus = "idle" | "loading" | "ready" | "missing" | "error";

export default function MusicPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [artFailed, setArtFailed] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [lyricsStatus, setLyricsStatus] = useState<LyricsStatus>("idle");
  const [hasInteracted, setHasInteracted] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const lyricsCacheRef = useRef(new Map<string, LyricLine[] | null>());
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const activeTrack = tracks[trackIndex];

  const goTo = (index: number) => {
    setCurrent(0);
    setDuration(0);
    setTrackIndex(((index % tracks.length) + tracks.length) % tracks.length);
  };
  const nextTrack = () => goTo(trackIndex + 1);
  const previousTrack = () => goTo(trackIndex - 1);

  useEffect(() => setArtFailed(false), [trackIndex]);

  useEffect(() => {
    const cacheKey = `${activeTrack.title}::${activeTrack.artist}`;
    const cached = lyricsCacheRef.current.get(cacheKey);

    if (lyricsCacheRef.current.has(cacheKey)) {
      setLyrics(cached ?? []);
      setLyricsStatus(cached?.length ? "ready" : "missing");
      return;
    }

    setLyrics([]);
    setLyricsStatus("loading");

    const controller = new AbortController();
    fetchSyncedLyrics(activeTrack, undefined, controller.signal)
      .then((lines) => {
        if (controller.signal.aborted) return;
        lyricsCacheRef.current.set(cacheKey, lines);
        setLyrics(lines ?? []);
        setLyricsStatus(lines?.length ? "ready" : "missing");
      })
      .catch((error) => {
        if ((error as Error).name === "AbortError") return;
        lyricsCacheRef.current.set(cacheKey, null);
        setLyrics([]);
        setLyricsStatus("error");
      });

    return () => {
      controller.abort();
    };
  }, [activeTrack]);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT?.Player) return;

      if (!playerRef.current) {
        playerRef.current = new window.YT.Player(mountRef.current, {
          height: "0",
          width: "0",
          videoId: activeTrack.embedId,
          playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              setIsReady(true);
              playerRef.current?.setVolume(VOLUME);
            },
            onStateChange: (event) => {
              if (event.data === 1) setIsPlaying(true);
              if (event.data === 2) setIsPlaying(false);
              if (event.data === 0) {
                setCurrent(0);
                setDuration(0);
                setTrackIndex((prev) => (prev + 1) % tracks.length);
              }
            },
          },
        });
      } else {
        setCurrent(0);
        setDuration(0);
        if (isPlayingRef.current) playerRef.current.loadVideoById(activeTrack.embedId);
        else playerRef.current.cueVideoById(activeTrack.embedId);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeTrack.embedId]);

  useEffect(() => {
    let rafId = 0;

    const syncProgress = () => {
      const player = playerRef.current;
      if (player?.getDuration) {
        setCurrent(player.getCurrentTime?.() || 0);
        setDuration(player.getDuration?.() || 0);
      }

      if (isPlayingRef.current) rafId = window.requestAnimationFrame(syncProgress);
    };

    syncProgress();
    return () => window.cancelAnimationFrame(rafId);
  }, [isPlaying, trackIndex]);

  const togglePlay = () => {
    const player = playerRef.current;
    if (!isReady || !player) return;
    setHasInteracted(true);
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const player = playerRef.current;
    if (!player || duration <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    player.seekTo(fraction * duration, true);
    setCurrent(fraction * duration);
  };

  const progress = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
  const activeLyricIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    const currentWithLatency = current + LYRIC_VISUAL_SYNC_OFFSET;

    for (let i = lyrics.length - 1; i >= 0; i -= 1) {
      if (currentWithLatency >= lyrics[i].time) return i;
    }

    return -1;
  }, [current, lyrics]);

  const currentLyric = activeLyricIndex >= 0 ? lyrics[activeLyricIndex] : null;
  const lyricText = currentLyric?.text || "Syncing...";

  return (
    <aside
      aria-label="Music player"
      className="fixed left-4 right-4 top-4 z-30 isolate mx-auto w-[min(92vw,320px)] sm:left-auto sm:right-5 sm:top-5 sm:mx-0"
    >
      <div className="music-card group relative overflow-hidden rounded-2xl p-2.5">
        <DancingAnimeGif />
        <div className="relative z-10 flex items-center gap-3 pr-[3.6rem]">
          <div className="cd-disc is-spinning" aria-hidden="true">
            {artFailed ? (
              <FiMusic className="h-4 w-4" />
            ) : (
              <img
                src={thumbnailFor(activeTrack)}
                alt=""
                className="cd-label"
                draggable={false}
                onError={() => setArtFailed(true)}
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold tracking-tight text-zinc-100">
              {activeTrack.title}
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
              {activeTrack.artist}
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
          <div className="overflow-hidden">
            <div
              className="music-progress group/track mt-3 h-1 cursor-pointer rounded-full"
              onClick={seek}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(current)}
              tabIndex={0}
            >
              <div className="music-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-3">
              <button type="button" aria-label="Previous track" onClick={previousTrack} className="music-btn h-8 w-8">
                <FiSkipBack className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlay}
                disabled={!isReady}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-900 transition hover:scale-105 hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPlaying ? <FiPause className="h-[18px] w-[18px]" /> : <FiPlay className="h-[18px] w-[18px] translate-x-[1px]" />}
              </button>
              <button type="button" aria-label="Next track" onClick={nextTrack} className="music-btn h-8 w-8">
                <FiSkipForward className="h-4 w-4" />
              </button>
            </div>

            <AnimatedLyrics
              activeIndex={activeLyricIndex}
              currentText={lyricText}
              shouldShow={hasInteracted}
              status={lyricsStatus}
            />
          </div>
        </div>

        <div ref={mountRef} className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true" />
      </div>
    </aside>
  );
}

function DancingAnimeGif() {
  return (
    <div className="anime-dancer-frame" aria-hidden="true">
      <img
        src={DANCER_GIF}
        alt=""
        className="anime-dancer-gif"
        draggable={false}
        loading="lazy"
      />
    </div>
  );
}

type AnimatedLyricsProps = {
  activeIndex: number;
  currentText: string;
  shouldShow: boolean;
  status: LyricsStatus;
};

function AnimatedLyrics({ activeIndex, currentText, shouldShow, status }: AnimatedLyricsProps) {
  const reduceMotion = useReducedMotion();

  if (!shouldShow) return null;

  return (
    <div className="lyrics-panel mt-3 min-h-[3.8rem] rounded-xl px-3 py-2 text-center">
      <AnimatePresence mode="wait" initial={false}>
        {status === "ready" ? (
          <motion.div
            key="lyrics-ready"
            className="lyrics-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${activeIndex}-${currentText}`}
                className="lyrics-current font-display text-sm font-semibold leading-snug text-zinc-50"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 14, scale: 0.98, filter: "blur(10px)" }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                }
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -16, scale: 1.02, filter: "blur(8px)" }
                }
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="sr-only">{currentText}</span>
                <span aria-hidden="true" className="lyrics-word-row">
                  {splitWords(currentText).map((word, index) => (
                    <motion.span
                      key={`${word}-${index}`}
                      className="lyrics-word"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(6px)" }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.36,
                        delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.18),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key={status}
            className="grid h-full min-h-[2.85rem] place-items-center"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {status === "missing" ? (
              <AnimatedNoLyrics reduceMotion={reduceMotion} />
            ) : (
              <p className="lyrics-status-text font-display text-sm font-semibold text-zinc-400">
                {status === "loading" && "Syncing lyrics"}
                {status === "error" && "Lyrics unavailable"}
                {status === "idle" && "Lyrics"}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function splitWords(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length ? words : ["Syncing..."];
}

function AnimatedNoLyrics({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <p className="no-lyrics-text font-display text-base font-semibold tracking-wide text-zinc-300">
      {"no lyrics :(".split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.35,
            delay: reduceMotion ? 0 : index * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char === " " ? "\u00a0" : char}
        </motion.span>
      ))}
    </p>
  );
}
