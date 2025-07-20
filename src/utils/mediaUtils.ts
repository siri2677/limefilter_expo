import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { MediaItem } from '../types';

export const getFileInfo = async (uri: string): Promise<Partial<MediaItem>> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('파일이 존재하지 않습니다.');
    }

    return {
      size: fileInfo.size || 0,
      createdAt: new Date(fileInfo.modificationTime || Date.now()),
    };
  } catch (error) {
    console.error('파일 정보 가져오기 실패:', error);
    throw error;
  }
};

export const getMediaType = (uri: string): 'image' | 'video' | 'audio' => {
  const extension = uri.split('.').pop()?.toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  const audioExtensions = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'];
  
  if (imageExtensions.includes(extension || '')) {
    return 'image';
  } else if (videoExtensions.includes(extension || '')) {
    return 'video';
  } else if (audioExtensions.includes(extension || '')) {
    return 'audio';
  }
  
  return 'image'; // 기본값
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const copyFileToAppDirectory = async (uri: string): Promise<string> => {
  try {
    const fileName = uri.split('/').pop() || 'media';
    const newUri = `${FileSystem.documentDirectory}${generateUniqueId()}_${fileName}`;
    
    await FileSystem.copyAsync({
      from: uri,
      to: newUri,
    });
    
    return newUri;
  } catch (error) {
    console.error('파일 복사 실패:', error);
    throw error;
  }
}; 