/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from 'react';
import { VideoControls } from './VideoControls';

// Add type declaration for YouTube API
declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

// Define YouTube player event types
interface YouTubePlayerEvent {
  target: YouTubePlayer;
}

interface YouTubeStateChangeEvent {
  data: number;
  target: YouTubePlayer;
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  destroy?: () => void;
}

interface YouTubePlayerProps {
  videoId: string;
}

export const YouTubePlayer = ({ videoId }: YouTubePlayerProps) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hasInitialized = useRef(false);
  const [userClickedPlay, setUserClickedPlay] = useState(false);
  const [startPlayback, setStartPlayback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleTouch = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
    };
    
    container.addEventListener('touchstart', handleTouch, { passive: true });
    
    return () => {
      container.removeEventListener('touchstart', handleTouch);
    };
  }, [hasUserInteracted]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }

        const iframeContainer = document.createElement('div');
        iframeContainer.innerHTML = `<iframe id="youtube-iframe-${videoId}" src="https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&widgetid=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        document.getElementById(`youtube-player-${videoId}`)?.appendChild(iframeContainer.firstChild as Node);
        
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };
      });
    };

    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI();

        playerRef.current = new window.YT.Player(`youtube-iframe-${videoId}`, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 0, // Don't autoplay initially
            controls: 0, // Use our custom controls
            rel: 0,
            showinfo: 0,
            mute: 1, // Always start muted to comply with autoplay policies
            enablejsapi: 1,
            playsinline: 1, // Important for mobile playback
            origin: window.location.origin,
            fs: 1,
            modestbranding: 1,
            disablekb: 1, // Disable keyboard controls to prevent unexpected state changes
            iv_load_policy: 3, // Disable annotations
          },
          events: {
            onReady: (event: YouTubePlayerEvent) => {
              setPlayerReady(true);
              setDuration(event.target.getDuration());
              event.target.setVolume(50);
            },
            onStateChange: (event: YouTubeStateChangeEvent) => {
              setIsPlaying(event.data === 1);
              
              if (event.data === 0) {
                event.target.seekTo(0, true);
                setIsPlaying(false);
              }
            }
          },
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
      }
    };

    initializePlayer();
    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playerReady && isPlaying) {
      interval = setInterval(() => {
        try {
          if (playerRef.current && playerRef.current.getCurrentTime) {
            const time = playerRef.current.getCurrentTime();
            setCurrentTime(time);
          }
        } catch (error) {
          console.error('Error getting current time:', error);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playerReady, isPlaying]);
  
  useEffect(() => {
    if (!playerRef.current || !playerReady || !hasUserInteracted) return;
    
    if (!isPlaying) return;
    
    if (!isMuted) {
      try {
        const timer = setTimeout(() => {
          playerRef.current?.unMute();
          playerRef.current?.setVolume(50);
        }, 200);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error setting volume after user interaction:', error);
      }
    }
  }, [playerReady, hasUserInteracted, isPlaying, isMuted]);

  const handlePlay = () => {
    if (!playerRef.current || !playerReady) return;
    
    try {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }
      
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.mute();
        setIsMuted(true);
        
        playerRef.current.playVideo();
        
        if (hasUserInteracted) {
          setTimeout(() => {
            try {
              if (playerRef.current && isPlaying) {
                playerRef.current.unMute();
                playerRef.current.setVolume(50);
                setIsMuted(false);
              }
            } catch (error) {
              console.error('Error unmuting video:', error);
            }
          }, 500); // Longer delay to ensure browser recognizes user interaction
        }
      }
    } catch (error) {
      console.error('Error in handlePlay:', error);
    }
  };

  const handleSeek = (time: number) => {
    try {
      if (playerRef.current && playerRef.current.seekTo && playerReady) {
        playerRef.current.seekTo(time, true);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleMute = (muted: boolean) => {
    if (!playerRef.current || !playerReady) return;
    try {
      const wasPlaying = isPlaying;
      const currentVolume = playerRef.current.getVolume();
      
      if (muted) {
        playerRef.current.mute();
        setIsMuted(true);
      } else {
        if (hasUserInteracted) {
          if (!isPlaying) {
            playerRef.current.playVideo();
          }
          
          setTimeout(() => {
            try {
              if (playerRef.current) {
                playerRef.current.unMute();
                playerRef.current.setVolume(currentVolume > 0 ? currentVolume : 50);
                
                if (wasPlaying && !isPlaying) {
                  playerRef.current.playVideo();
                }
                
                setIsMuted(false);
              }
            } catch (error) {
              console.error('Error in delayed unmute:', error);
            }
          }, 300);
        }
      }
    } catch (error) {
      console.error('Error in handleMute:', error);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
    >
      <div id={`youtube-player-${videoId}`} className="w-full h-full" />
      {playerReady && (
        <VideoControls
          isYoutube={true}
          isPlaying={isPlaying}
          duration={duration}
          currentTime={currentTime}
          onPlay={handlePlay}
          onSeek={handleSeek}
          onFullscreen={handleFullscreen}
          isMuted={isMuted}
          onMute={handleMute}
        />
      )}
      {!hasUserInteracted && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-10"
          onClick={() => {
            setHasUserInteracted(true);
            handlePlay();
          }}
        >
          <div className="text-white text-center bg-black/70 p-6 rounded-lg">
            <div className="text-6xl mb-4">▶️</div>
            <p className="text-lg">Click to play video</p>
          </div>
        </div>
      )}
    </div>
  );
};
