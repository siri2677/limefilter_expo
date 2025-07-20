import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Canvas,
  Image,
  useImage,
  ColorMatrix,
  Blur,
} from '@shopify/react-native-skia';
import { Filter } from '../types';

interface FilteredImageProps {
  uri: string;
  filters: Filter[];
  width?: number;
  height?: number;
}

const { width: screenWidth } = Dimensions.get('window');
const DEFAULT_SIZE = screenWidth - 32;

export const FilteredImage: React.FC<FilteredImageProps> = ({
  uri,
  filters,
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
}) => {
  const image = useImage(uri);

  const getColorMatrix = () => {
    if (!image) return null;

    console.log('Filters applied:', filters); // 디버깅용

    // 여러 필터 조합 적용
    let colorMatrix = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];

    filters.forEach((filter) => {
      switch (filter.id) {
        case 'contrast':
          const contrast = filter.parameters.value;
          colorMatrix = [
            contrast, 0, 0, 0,
            0, contrast, 0, 0,
            0, 0, contrast, 0,
            0, 0, 0, 1,
          ];
          break;
        case 'brightness':
          const brightness = filter.parameters.value;
          colorMatrix = [
            1, 0, 0, brightness,
            0, 1, 0, brightness,
            0, 0, 1, brightness,
            0, 0, 0, 1,
          ];
          break;
        case 'saturation':
          const saturation = filter.parameters.value;
          colorMatrix = [
            0.213 + 0.787 * saturation, 0.213 - 0.213 * saturation, 0.213 - 0.213 * saturation, 0,
            0.715 - 0.715 * saturation, 0.715 + 0.285 * saturation, 0.715 - 0.715 * saturation, 0,
            0.072 - 0.072 * saturation, 0.072 - 0.072 * saturation, 0.072 + 0.928 * saturation, 0,
            0, 0, 0, 1,
          ];
          break;
        case 'blackAndWhite':
          if (filter.parameters.value > 0) {
            colorMatrix = [
              0.299, 0.587, 0.114, 0,
              0.299, 0.587, 0.114, 0,
              0.299, 0.587, 0.114, 0,
              0, 0, 0, 1,
            ];
          }
          break;
        case 'sepia':
          if (filter.parameters.value > 0) {
            colorMatrix = [
              0.393, 0.769, 0.189, 0,
              0.349, 0.686, 0.168, 0,
              0.272, 0.534, 0.131, 0,
              0, 0, 0, 1,
            ];
          }
          break;
        case 'invert':
          if (filter.parameters.value > 0) {
            colorMatrix = [
              -1, 0, 0, 1,
              0, -1, 0, 1,
              0, 0, -1, 1,
              0, 0, 0, 1,
            ];
          }
          break;
      }
    });

    return colorMatrix;
  };

  if (!image) {
    return <View style={[styles.container, { width, height }]} />;
  }

  const colorMatrix = getColorMatrix();
  const blurFilter = filters.find(f => f.id === 'blur');

  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas style={styles.canvas}>
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        />
        {colorMatrix && (
          <ColorMatrix matrix={colorMatrix} />
        )}
        {blurFilter && blurFilter.parameters.value > 0 && (
          <Blur blur={blurFilter.parameters.value} />
        )}
      </Canvas>
    </View>
  );
};

const multiplyMatrix = (a: number[], b: number[]): number[] => {
  const result = new Array(16).fill(0);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i * 4 + j] += a[i * 5 + k] * b[k * 5 + j];
      }
    }
  }
  return result;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
  },
}); 