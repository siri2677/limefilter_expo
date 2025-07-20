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

  const identityMatrix = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
  ];

  const brightnessMatrix = (v: number) => [
    1, 0, 0, 0, v,
    0, 1, 0, 0, v,
    0, 0, 1, 0, v,
    0, 0, 0, 1, 0,
  ];

  const contrastMatrix = (c: number) => {
    const t = 0.5 * (1 - c);
    return [
      c, 0, 0, 0, t,
      0, c, 0, 0, t,
      0, 0, c, 0, t,
      0, 0, 0, 1, 0,
    ];
  };

  const saturationMatrix = (s: number) => {
    const invS = 1 - s;
    const R = 0.2126;
    const G = 0.7152;
    const B = 0.0722;
    return [
      R * invS + s, G * invS,     B * invS,     0, 0,
      R * invS,     G * invS + s, B * invS,     0, 0,
      R * invS,     G * invS,     B * invS + s, 0, 0,
      0,            0,            0,            1, 0,
    ];
  };

  const hueRotateMatrix = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const lumR = 0.213;
    const lumG = 0.715;
    const lumB = 0.072;
    return [
      lumR + cosA * (1 - lumR) + sinA * (-lumR),
      lumG + cosA * (-lumG) + sinA * (-lumG),
      lumB + cosA * (-lumB) + sinA * (1 - lumB), 0, 0,

      lumR + cosA * (-lumR) + sinA * 0.143,
      lumG + cosA * (1 - lumG) + sinA * 0.140,
      lumB + cosA * (-lumB) + sinA * (-0.283), 0, 0,

      lumR + cosA * (-lumR) + sinA * (-(1 - lumR)),
      lumG + cosA * (-lumG) + sinA * lumG,
      lumB + cosA * (1 - lumB) + sinA * lumB, 0, 0,

      0, 0, 0, 1, 0,
    ];
  };

  const multiplyMatrix = (a: number[], b: number[]): number[] => {
    const result = new Array(20).fill(0);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        result[row * 5 + col] =
          a[row * 5 + 0] * b[0 + col] +
          a[row * 5 + 1] * b[5 + col] +
          a[row * 5 + 2] * b[10 + col] +
          a[row * 5 + 3] * b[15 + col];
        if (col === 4) {
          result[row * 5 + col] += a[row * 5 + 4];
        }
      }
    }
    return result;
  };

  const getColorMatrix = () => {
    if (!image) return null;
    let matrix = identityMatrix;

    filters.forEach(f => {
      switch (f.id) {
        case 'brightness':
          matrix = multiplyMatrix(matrix, brightnessMatrix(f.parameters.value));
          break;
        case 'contrast':
          matrix = multiplyMatrix(matrix, contrastMatrix(f.parameters.value));
          break;
        case 'saturation':
          matrix = multiplyMatrix(matrix, saturationMatrix(f.parameters.value));
          break;
        case 'hue':
          matrix = multiplyMatrix(matrix, hueRotateMatrix(f.parameters.value));
          break;
      }
    });

    return matrix;
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
        >
          {colorMatrix && <ColorMatrix matrix={colorMatrix} />}
          {blurFilter && blurFilter.parameters.value > 0 && (
            <Blur blur={blurFilter.parameters.value} />
          )}
        </Image>
      </Canvas>
    </View>
  );
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
