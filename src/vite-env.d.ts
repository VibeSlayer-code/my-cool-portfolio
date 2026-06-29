declare global {
  type YouTubePlayerState = -1 | 0 | 1 | 2 | 3 | 5;

  interface YouTubePlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    stopVideo: () => void;
    cueVideoById: (videoId: string) => void;
    loadVideoById: (videoId: string) => void;
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
    setVolume: (volume: number) => void;
    getVolume: () => number;
    mute: () => void;
    unMute: () => void;
    isMuted: () => boolean;
    getCurrentTime: () => number;
    getDuration: () => number;
    getPlayerState: () => YouTubePlayerState;
    destroy: () => void;
  }

  interface YouTubePlayerConstructor {
    new (
      element: HTMLElement,
      options: {
        height?: string;
        width?: string;
        videoId?: string;
        playerVars?: Record<string, string | number>;
        events?: {
          onReady?: () => void;
          onStateChange?: (event: { data: YouTubePlayerState }) => void;
        };
      },
    ): YouTubePlayer;
  }

  interface Window {
    YT?: {
      Player: YouTubePlayerConstructor;
      PlayerState?: {
        PLAYING: 1;
        PAUSED: 2;
        ENDED: 0;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};
