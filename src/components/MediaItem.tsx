import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Video, ResizeMode } from 'expo-av';
import { MediaItem as MediaItemType } from '../types';
import { COLORS } from '../constants/colors';
import { formatFileSize, formatDuration } from '../utils/mediaUtils';

interface MediaItemProps {
  item: MediaItemType;
  onPress: (item: MediaItemType) => void;
  selected?: boolean;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3;

export const MediaItem: React.FC<MediaItemProps> = ({ item, onPress, selected = false }) => {
  const renderMedia = () => {
    if (item.type === 'video') {
      return (
        <Video
          source={{ uri: item.uri }}
          style={styles.media}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isMuted={true}
          useNativeControls={false}
        />
      );
    }
    
    return (
      <Image
        source={{ uri: item.uri }}
        style={styles.media}
        contentFit="cover"
        transition={200}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.mediaContainer}>
        {renderMedia()}
        {item.type === 'video' && item.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {formatDuration(item.duration)}
            </Text>
          </View>
        )}
        {selected && (
          <View style={styles.selectedOverlay}>
            <View style={styles.checkmark} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.size}>
          {formatFileSize(item.size)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    marginBottom: 16,
  },
  selected: {
    opacity: 0.8,
  },
  mediaContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceLight,
  },
  media: {
    width: '100%',
    height: ITEM_WIDTH,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '600',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginTop: 8,
  },
  name: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  size: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
}); 