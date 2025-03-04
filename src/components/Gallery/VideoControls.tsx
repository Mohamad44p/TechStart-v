import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2,
  RotateCcw,
  FastForward,
} from 'lucide-react';

interface VideoControlsProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  isYoutube?: boolean;
  isPlaying?: boolean;
  duration?: number;
  currentTime?: number;
  onPlay?: () => void;
  onSeek?: (time: number) => void;
  onFullscreen?: () => void;
  onMute?: (muted: boolean) => void;
  isMuted?: boolean;
}

export const VideoControls = ({ 
  videoRef,
  isYoutube,
  isPlaying: externalIsPlaying,
  duration: externalDuration,
  currentTime: externalCurrentTime,
  onPlay,
  onSeek,
  onFullscreen,
  onMute,
}: VideoControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isYoutube) {
      setIsPlaying(externalIsPlaying || false);
      setDuration(externalDuration || 0);
      setCurrentTime(externalCurrentTime || 0);
      setProgress(((externalCurrentTime || 0) / (externalDuration || 1)) * 100);
    } else if (videoRef?.current) {
      const video = videoRef.current;
      setDuration(video.duration);

      const timeUpdate = () => {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      };

      video.addEventListener('timeupdate', timeUpdate);
      video.addEventListener('loadedmetadata', () => setDuration(video.duration));
      video.addEventListener('play', () => setIsPlaying(true));
      video.addEventListener('pause', () => setIsPlaying(false));

      return () => {
        video.removeEventListener('timeupdate', timeUpdate);
        video.removeEventListener('loadedmetadata', () => {});
        video.removeEventListener('play', () => {});
        video.removeEventListener('pause', () => {});
      };
    }
  }, [videoRef, isYoutube, externalIsPlaying, externalDuration, externalCurrentTime]);

  const togglePlay = () => {
    if (isYoutube) {
      onPlay?.();
    } else if (videoRef?.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (isYoutube) {
      onMute?.(!isMuted);
    } else if (videoRef?.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (isYoutube) {
      onMute?.(newVolume === 0);
    } else if (videoRef?.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * (isYoutube ? (externalDuration || 0) : (videoRef?.current?.duration || 0));
    
    if (isYoutube) {
      onSeek?.(newTime);
    } else if (videoRef?.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const seek = (seconds: number) => {
    if (!videoRef?.current) return;
    videoRef.current.currentTime += seconds;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
      {/* Progress bar */}
      <div 
        ref={progressRef}
        className="relative h-1 bg-gray-600 cursor-pointer mb-4"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute h-full bg-purple-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="hover:text-purple-400 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Rewind/Forward */}
          <button
            onClick={() => seek(-10)}
            className="hover:text-purple-400 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => seek(10)}
            className="hover:text-purple-400 transition-colors"
          >
            <FastForward size={20} />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="hover:text-purple-400 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-purple-500"
            />
          </div>

          {/* Time */}
          <div className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Fullscreen */}
        <button
          onClick={onFullscreen}
          className="hover:text-purple-400 transition-colors"
        >
          <Maximize2 size={20} />
        </button>
      </div>
    </div>
  );
};
