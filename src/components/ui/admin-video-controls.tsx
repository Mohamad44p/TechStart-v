/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Play, Pause, Volume2, VolumeX, RotateCcw, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VideoControlsProps {
  videoId: string
  className?: string
  type: 'youtube' | 'local'
}

export function AdminVideoControls({ videoId, className, type }: VideoControlsProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [volume, setVolume] = React.useState(1)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)
  const [youtubePlayer, setYoutubePlayer] = React.useState<any>(null)

  React.useEffect(() => {
    const video = document.getElementById(videoId) as HTMLVideoElement
    const iframe = document.getElementById(videoId) as HTMLIFrameElement

    if (type === 'local' && video) {
      videoRef.current = video
      video.addEventListener('timeupdate', () => {
        setCurrentTime(video.currentTime)
        setDuration(video.duration)
      })
      video.addEventListener('loadedmetadata', () => setDuration(video.duration))
      video.addEventListener('play', () => setIsPlaying(true))
      video.addEventListener('pause', () => setIsPlaying(false))
      video.volume = volume
    } else if (type === 'youtube' && iframe) {
      iframeRef.current = iframe
    }

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', () => {})
        video.removeEventListener('loadedmetadata', () => {})
        video.removeEventListener('play', () => {})
        video.removeEventListener('pause', () => {})
      }
    }
  }, [videoId, type, volume])

  React.useEffect(() => {
    if (type === 'youtube') {
      // Load YouTube API script if not already loaded
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Initialize player when API is ready
      const initPlayer = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        new (window as any).YT.Player(videoId, {
          events: {
            onStateChange: (event: any) => {
              // YouTube PlayerState: PLAYING = 1
              setIsPlaying(event.data === 1);
            },
            onReady: (event: any) => {
              setYoutubePlayer(event.target);
              setDuration(event.target.getDuration());
            }
          }
        });
      };

      if ((window as any).YT && (window as any).YT.Player) {
        initPlayer();
      } else {
        (window as any).onYouTubeIframeAPIReady = initPlayer;
      }
    }
  }, [videoId, type]);

  const handlePlayPause = React.useCallback(() => {
    if (type === 'local' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    } else if (type === 'youtube' && youtubePlayer) {
      try {
        if (isPlaying) {
          youtubePlayer.pauseVideo();
        } else {
          youtubePlayer.playVideo();
        }
      } catch (error) {
        console.error('YouTube player error:', error);
      }
    }
  }, [isPlaying, type, youtubePlayer])

  const handleTimeChange = React.useCallback((value: number[]) => {
    const newTime = value[0]
    if (type === 'local' && videoRef.current) {
      videoRef.current.currentTime = newTime
    } else if (type === 'youtube' && youtubePlayer) {
      youtubePlayer.seekTo(newTime, true);
    }
    setCurrentTime(newTime)
  }, [type, youtubePlayer])

  const handleVolumeChange = React.useCallback((value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (type === 'local' && videoRef.current) {
      videoRef.current.volume = newVolume
    } else if (type === 'youtube' && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [newVolume * 100] }),
        '*'
      )
    }
    setIsMuted(newVolume === 0)
  }, [type])

  const handleMuteToggle = React.useCallback(() => {
    if (type === 'local' && videoRef.current) {
      videoRef.current.muted = !isMuted
    } else if (type === 'youtube' && iframeRef.current) {
      const command = isMuted ? 'unMute' : 'mute'
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command }),
        '*'
      )
    }
    setIsMuted(!isMuted)
  }, [isMuted, type])

  const handleRestart = React.useCallback(() => {
    handleTimeChange([0])
    if (!isPlaying) handlePlayPause()
  }, [handlePlayPause, handleTimeChange, isPlaying])

  const handleFullscreen = React.useCallback(() => {
    if (type === 'local' && videoRef.current) {
      videoRef.current.requestFullscreen()
    } else if (type === 'youtube' && iframeRef.current) {
      iframeRef.current.requestFullscreen()
    }
  }, [type])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn(
      "flex flex-col gap-2 p-2 rounded-md bg-black/60 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlayPause}
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMuteToggle}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-white text-xs min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleTimeChange}
            className="flex-1"
          />
          <span className="text-white text-xs min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestart}
          className="text-white hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleFullscreen}
          className="text-white hover:bg-white/20"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
