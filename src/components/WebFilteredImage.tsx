import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Filter } from '../types';

// 웹에서만 사용할 수 있는 CSS 필터 스타일
const webStyle = {
  filter: '',
};

interface WebFilteredImageProps {
  uri: string;
  filters: Filter[];
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');
const DEFAULT_SIZE = screenWidth - 32;

export const WebFilteredImage: React.FC<WebFilteredImageProps> = ({
  uri,
  filters,
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
}) => {
  const getFilterStyle = () => {
    let filterString = '';
    
    console.log('Web filters applied:', filters); // 디버깅용
    
    filters.forEach((filter) => {
      switch (filter.id) {
        case 'brightness':
          const brightness = 1 + filter.parameters.value;
          filterString += `brightness(${brightness}) `;
          break;
        case 'contrast':
          const contrast = filter.parameters.value;
          filterString += `contrast(${contrast}) `;
          break;
        case 'saturation':
          const saturation = filter.parameters.value;
          filterString += `saturate(${saturation}) `;
          break;
        case 'blur':
          const blur = filter.parameters.value;
          filterString += `blur(${blur}px) `;
          break;
        case 'blackAndWhite':
          if (filter.parameters.value > 0) {
            filterString += 'grayscale(1) ';
          }
          break;
        case 'sepia':
          const sepia = filter.parameters.value;
          filterString += `sepia(${sepia}) `;
          break;
        case 'invert':
          if (filter.parameters.value > 0) {
            filterString += 'invert(1) ';
          }
          break;
      }
    });
    
    console.log('Filter string:', filterString); // 디버깅용
    return filterString.trim();
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
}); 