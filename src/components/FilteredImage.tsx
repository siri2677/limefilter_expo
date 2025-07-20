import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Canvas,
  Image as SkiaImage,
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

  if (!image) {
    return <View style={[styles.container, { width, height }]} />;
  }

  const getColorMatrix = (): number[] | null => {
    let matrix = identityMatrix;

    filters.forEach((filter) => {
      const value = filter.parameters?.value;

      switch (filter.id) {
        case 'brightness': {
          const b = value;
          const brightnessMatrix = [
            1, 0, 0, 0, b,
            0, 1, 0, 0, b,
            0, 0, 1, 0, b,
            0, 0, 0, 1, 0,
          ];
          matrix = multiplyColorMatrix(matrix, brightnessMatrix);
          break;
        }

        case 'contrast': {
          const c = value;
          const t = 128 * (1 - c);
          const contrastMatrix = [
            c, 0, 0, 0, t,
            0, c, 0, 0, t,
            0, 0, c, 0, t,
            0, 0, 0, 1, 0,
          ];
          matrix = multiplyColorMatrix(matrix, contrastMatrix);
          break;
        }

        case 'grayscale': {
          const g = value;
          const grayscaleMatrix = [
            0.2126 + 0.7874 * (1 - g), 0.7152 - 0.7152 * (1 - g), 0.0722 - 0.0722 * (1 - g), 0, 0,
            0.2126 - 0.2126 * (1 - g), 0.7152 + 0.2848 * (1 - g), 0.0722 - 0.0722 * (1 - g), 0, 0,
            0.2126 - 0.2126 * (1 - g), 0.7152 - 0.7152 * (1 - g), 0.0722 + 0.9278 * (1 - g), 0, 0,
            0, 0, 0, 1, 0,
          ];
          matrix = multiplyColorMatrix(matrix, grayscaleMatrix);
          break;
        }

        case 'invert': {
          const invertMatrix = [
            -1, 0, 0, 0, 255,
            0, -1, 0, 0, 255,
            0, 0, -1, 0, 255,
            0, 0, 0, 1, 0,
          ];
          matrix = multiplyColorMatrix(matrix, invertMatrix);
          break;
        }

        // 세피아, 색조, 채도 등은 여기에 추가
      }
    });

    return matrix;
  };

  const colorMatrix = getColorMatrix();
  const blurFilter = filters.find(f => f.id === 'blur');
  const blurValue = blurFilter?.parameters?.value || 0;

  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas style={styles.canvas}>
        <SkiaImage
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        >
          {colorMatrix && <ColorMatrix matrix={colorMatrix} />}
          {blurValue > 0 && <Blur blur={blurValue} />}
        </SkiaImage>
      </Canvas>
    </View>
  );
};

// 4x5 ColorMatrix 곱셈 (20x20)
const multiplyColorMatrix = (a: number[], b: number[]): number[] => {
  const out = new Array(20).fill(0);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      out[row * 5 + col] =
        a[row * 5 + 0] * b[0 + col] +
        a[row * 5 + 1] * b[5 + col] +
        a[row * 5 + 2] * b[10 + col] +
        a[row * 5 + 3] * b[15 + col] +
        (col === 4 ? a[row * 5 + 4] : 0); // bias 추가
    }
  }
  return out;
};

const identityMatrix = [
  1, 0, 0, 0, 0,
  0, 1, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 1, 0,
];

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
  },
});
