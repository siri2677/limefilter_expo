import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { Filter } from '../types';

const { width: screenWidth } = Dimensions.get('window');
const SLIDER_WIDTH = screenWidth - 80; // 좌우 패딩 고려
const THUMB_SIZE = 24;
const TRACK_HEIGHT = 8;

interface FilterSliderProps {
  filter: Filter;
  onValueChange: (value: number) => void;
}

export const FilterSlider: React.FC<FilterSliderProps> = ({
  filter,
  onValueChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH);
  const sliderRef = useRef<View>(null);

  const handleSliderChange = (value: number) => {
    const clampedValue = Math.max(
      filter.parameters.min,
      Math.min(filter.parameters.max, value)
    );
    onValueChange(clampedValue);
  };

  const getSliderRatio = () => {
    const range = filter.parameters.max - filter.parameters.min;
    return (filter.parameters.value - filter.parameters.min) / range;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setIsDragging(true);
      sliderRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const touchX = evt.nativeEvent.pageX - pageX;
        // 슬라이더의 실제 사용 가능한 영역 계산
        const trackWidth = sliderWidth - THUMB_SIZE;
        const clampedTouchX = Math.max(0, Math.min(trackWidth, touchX));
        const ratio = clampedTouchX / trackWidth;
        const newValue = filter.parameters.min + ratio * (filter.parameters.max - filter.parameters.min);
        handleSliderChange(newValue);
      });
    },
    onPanResponderMove: (evt) => {
      sliderRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const touchX = evt.nativeEvent.pageX - pageX;
        // 슬라이더의 실제 사용 가능한 영역 계산
        const trackWidth = sliderWidth - THUMB_SIZE;
        const clampedTouchX = Math.max(0, Math.min(trackWidth, touchX));
        const ratio = clampedTouchX / trackWidth;
        const newValue = filter.parameters.min + ratio * (filter.parameters.max - filter.parameters.min);
        handleSliderChange(newValue);
      });
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
    },
  });

  const handleButtonPress = (increment: boolean) => {
    const step = (filter.parameters.max - filter.parameters.min) / 20;
    const newValue = increment
      ? filter.parameters.value + step
      : filter.parameters.value - step;
    handleSliderChange(newValue);
  };

  const ratio = getSliderRatio();
  const trackWidth = sliderWidth - THUMB_SIZE;
  const thumbPosition = ratio * trackWidth;
  const fillWidth = ratio * trackWidth;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{filter.name}</Text>
        <Text style={styles.value}>{filter.parameters.value.toFixed(1)}</Text>
      </View>
      
      <View style={styles.sliderContainer}>
        <View
          ref={sliderRef}
          style={styles.track}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setSliderWidth(width);
          }}
          {...panResponder.panHandlers}
        >
          <View style={styles.trackBackground} />
          <View
            style={[
              styles.trackFill,
              {
                width: fillWidth,
              },
            ]}
          />
          <View
            style={[
              styles.thumb,
              isDragging && styles.thumbActive,
              {
                left: thumbPosition,
              },
            ]}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <View
            style={styles.button}
            onTouchEnd={() => handleButtonPress(false)}
          >
            <Text style={styles.buttonText}>-</Text>
          </View>
          <View
            style={styles.button}
            onTouchEnd={() => handleButtonPress(true)}
          >
            <Text style={styles.buttonText}>+</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  value: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  track: {
    flex: 1,
    height: THUMB_SIZE,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    height: TRACK_HEIGHT,
    backgroundColor: COLORS.border,
    borderRadius: TRACK_HEIGHT / 2,
    marginHorizontal: THUMB_SIZE / 2,
  },
  trackFill: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    backgroundColor: COLORS.accent,
    borderRadius: TRACK_HEIGHT / 2,
    left: THUMB_SIZE / 2,
    top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: COLORS.accent,
    borderWidth: 3,
    borderColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    top: 0,
  },
  thumbActive: {
    backgroundColor: COLORS.accent,
    transform: [{ scale: 1.2 }],
    borderColor: COLORS.text,
    borderWidth: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
  },
}); 