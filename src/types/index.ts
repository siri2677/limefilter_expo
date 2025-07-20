export interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video' | 'audio';
  name: string;
  size: number;
  duration?: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

export interface Filter {
  id: string;
  name: string;
  type: 'color' | 'blur' | 'effect' | 'transform';
  parameters: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  mediaItems: MediaItem[];
  filters: Filter[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasState {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
}

export interface AudioTrack {
  id: string;
  uri: string;
  volume: number;
  startTime: number;
  duration: number;
  isMuted: boolean;
}

export interface VideoTrack {
  id: string;
  uri: string;
  startTime: number;
  duration: number;
  filters: Filter[];
  volume: number;
  isMuted: boolean;
}

export interface Timeline {
  duration: number;
  audioTracks: AudioTrack[];
  videoTracks: VideoTrack[];
  currentTime: number;
} 