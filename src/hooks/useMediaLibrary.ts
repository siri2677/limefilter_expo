import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { MediaItem } from '../types';
import { getFileInfo, getMediaType, generateUniqueId } from '../utils/mediaUtils';

export const useMediaLibrary = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<MediaLibrary.PermissionStatus | null>(null);

  const requestPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermission(status);
      return status === 'granted';
    } catch (err) {
      setError('권한 요청 실패');
      return false;
    }
  };

  const loadMedia = async () => {
    if (permission !== 'granted') {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        // 권한이 없으면 테스트용 이미지 제공
        const testImages: MediaItem[] = [
          {
            id: generateUniqueId(),
            uri: 'https://picsum.photos/400/400?random=1',
            type: 'image',
            name: '테스트 이미지 1',
            size: 1024 * 1024,
            width: 400,
            height: 400,
            createdAt: new Date(),
          },
          {
            id: generateUniqueId(),
            uri: 'https://picsum.photos/400/400?random=2',
            type: 'image',
            name: '테스트 이미지 2',
            size: 1024 * 1024,
            width: 400,
            height: 400,
            createdAt: new Date(),
          },
          {
            id: generateUniqueId(),
            uri: 'https://picsum.photos/400/400?random=3',
            type: 'image',
            name: '테스트 이미지 3',
            size: 1024 * 1024,
            width: 400,
            height: 400,
            createdAt: new Date(),
          },
        ];
        setMediaItems(testImages);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: ['photo', 'video'],
        first: 100,
        sortBy: ['creationTime'],
      });

      const processedMedia: MediaItem[] = await Promise.all(
        media.assets.map(async (asset) => {
          const fileInfo = await getFileInfo(asset.uri);
          return {
            id: generateUniqueId(),
            uri: asset.uri,
            type: getMediaType(asset.uri),
            name: asset.filename || 'Unknown',
            size: fileInfo.size || 0,
            duration: asset.duration,
            width: asset.width,
            height: asset.height,
            createdAt: fileInfo.createdAt || new Date(asset.creationTime),
          };
        })
      );

      setMediaItems(processedMedia);
    } catch (err) {
      setError('미디어 로드 실패');
      console.error('미디어 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshMedia = () => {
    loadMedia();
  };

  useEffect(() => {
    loadMedia();
  }, []);

  return {
    mediaItems,
    loading,
    error,
    permission,
    refreshMedia,
    requestPermission,
  };
}; 