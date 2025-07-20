import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilteredImage } from '../components/FilteredImage';
import { WebFilteredImage } from '../components/WebFilteredImage';
import { Platform } from 'react-native';
import { FilterSlider } from '../components/FilterSlider';
import { COLORS, GRADIENTS } from '../constants/colors';
import { AVAILABLE_FILTERS, getFilterById } from '../constants/filters';
import { MediaItem, Filter } from '../types';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useRef } from 'react';

interface EditorScreenProps {
  navigation: any;
  route: {
    params: {
      mediaItems: MediaItem[];
    };
  };
}

const { width: screenWidth } = Dimensions.get('window');
const PREVIEW_HORIZONTAL_PADDING = 32; // 좌우 패딩 합
const previewWidth = screenWidth - PREVIEW_HORIZONTAL_PADDING;
const previewHeight = previewWidth * 3 / 4;

export const EditorScreen: React.FC<EditorScreenProps> = ({ navigation, route }) => {
  const { mediaItems } = route.params;
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const viewShotRef = useRef(null);

  const currentMedia = mediaItems[currentMediaIndex];

  const handleFilterToggle = useCallback((filterId: string) => {
    setActiveFilters(prev => {
      const existingFilter = prev.find(f => f.id === filterId);
      if (existingFilter) {
        // 이미 있으면 제거
        return prev.filter(f => f.id !== filterId);
      } else {
        const newFilter = getFilterById(filterId);
        if (newFilter) {
          // 새로 추가할 때 맨 앞에 넣기
          return [{ ...newFilter }, ...prev];
        }
        return prev;
      }
    });
  }, []);

  const handleFilterValueChange = useCallback((filterId: string, value: number) => {
    console.log('Filter value changed:', filterId, value); // 디버깅용
    setActiveFilters(prev => 
      prev.map(filter => 
        filter.id === filterId 
          ? { ...filter, parameters: { ...filter.parameters, value } }
          : filter
      )
    );
  }, []);

  const handleSave = useCallback(async () => {
    try {
      // 권한 요청
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('갤러리 저장 권한이 필요합니다.');
        return;
      }
      // 프리뷰 캡처
      const uri = await viewShotRef.current.capture?.();
      if (!uri) {
        alert('이미지 캡처에 실패했습니다.');
        return;
      }
      // 갤러리에 저장
      await MediaLibrary.saveToLibraryAsync(uri);
      alert('저장되었습니다!');
      navigation.goBack();
    } catch (e) {
      alert('저장 중 오류 발생: ' + e);
    }
  }, [navigation]);

  const handleNext = useCallback(() => {
    if (currentMediaIndex < mediaItems.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    }
  }, [currentMediaIndex, mediaItems.length]);

  const handlePrev = useCallback(() => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    }
  }, [currentMediaIndex]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>편집</Text>
        <Text style={styles.headerSubtitle}>
          {currentMediaIndex + 1} / {mediaItems.length}
        </Text>
      </View>
      
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Ionicons name="checkmark" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );

  const renderMediaViewer = () => (
    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.mediaContainer}>
      {Platform.OS === 'web' ? (
        <WebFilteredImage
          uri={currentMedia.uri}
          filters={activeFilters}
          width={previewWidth}
          height={previewHeight}
        />
      ) : (
        <FilteredImage
          uri={currentMedia.uri}
          filters={activeFilters}
          width={previewWidth}
          height={previewHeight}
        />
      )}
    </ViewShot>
  );

  const renderNavigation = () => (
    <View style={styles.navigation}>
      <TouchableOpacity
        onPress={handlePrev}
        disabled={currentMediaIndex === 0}
        style={[styles.navButton, currentMediaIndex === 0 && styles.navButtonDisabled]}
      >
        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
      
      <Text style={styles.navText}>
        {currentMedia.name}
      </Text>
      
      <TouchableOpacity
        onPress={handleNext}
        disabled={currentMediaIndex === mediaItems.length - 1}
        style={[styles.navButton, currentMediaIndex === mediaItems.length - 1 && styles.navButtonDisabled]}
      >
        <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <Text style={styles.filtersTitle}>필터</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterButtons}>
        {AVAILABLE_FILTERS.map((filter, idx) => {
          const isActive = activeFilters.some(f => f.id === filter.id);
          const isLast = idx === AVAILABLE_FILTERS.length - 1;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                isActive && styles.filterButtonActive,
                isLast && { marginRight: 0 }
              ]}
              onPress={() => handleFilterToggle(filter.id)}
            >
              <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <ScrollView
        style={styles.filterSliders}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
        }}
        showsVerticalScrollIndicator={false}
      >
        {activeFilters.map(filter => (
          <FilterSlider
            key={filter.id}
            filter={filter}
            onValueChange={(value) => handleFilterValueChange(filter.id, value)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.content}>
        {renderHeader()}
        {renderMediaViewer()}
        {renderNavigation()}
        {renderFilters()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    padding: 0,
    margin: 0,
    backgroundColor: COLORS.background, // 배경색 명확히 지정
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: 0,
    margin: 0

  },
  backButton: {
    padding: 0,
    margin: 0
  },
  headerCenter: {
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    margin: 0,
    padding: 0
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    margin: 0,
    padding: 0
  },
  saveButton: {
    padding: 0,
    margin: 0
  },
  mediaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    marginBottom: 10
  },
  fileName: {
    textAlign: 'center',
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 0,
    padding: 0,
    marginTop: 0,
    paddingTop: 10, // 딱 10px 간격
    marginBottom: 0,
    paddingBottom: 0
  },
  navButton: {
    padding: 0,
    margin: 0
  },
  navButtonDisabled: {
    opacity: 0.3
  },
  navText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
    margin: 0,
    padding: 0
  },
  filtersContainer: {
    maxHeight: 300,
    flexDirection: 'column',
    paddingHorizontal: 0,
    marginTop: 5,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    margin: 0,
    padding: 0
  },
  filterButtons: {
    padding: 0,
    marginTop: 5,
    height: 60, // 고정 높이 추가
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 32,
    height: 36,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginRight: 8, // 버튼 사이 가로 간격
    borderWidth: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '500',
    margin: 0,
    padding: 0,
  },
  filterButtonTextActive: {
    color: COLORS.text,
  },
  filterSliders: {
    flexGrow: 1,
    margin: 0,
    padding: 0,
  },
}); 