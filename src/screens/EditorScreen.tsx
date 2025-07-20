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

interface EditorScreenProps {
  navigation: any;
  route: {
    params: {
      mediaItems: MediaItem[];
    };
  };
}

const { width: screenWidth } = Dimensions.get('window');

export const EditorScreen: React.FC<EditorScreenProps> = ({ navigation, route }) => {
  const { mediaItems } = route.params;
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

  const currentMedia = mediaItems[currentMediaIndex];

  const handleFilterToggle = useCallback((filterId: string) => {
    setActiveFilters(prev => {
      const existingFilter = prev.find(f => f.id === filterId);
      if (existingFilter) {
        return prev.filter(f => f.id !== filterId);
      } else {
        const newFilter = getFilterById(filterId);
        if (newFilter) {
          return [...prev, { ...newFilter }];
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

  const handleSave = useCallback(() => {
    // TODO: 저장 로직 구현
    navigation.goBack();
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
    <View style={styles.mediaContainer}>
      {Platform.OS === 'web' ? (
        <WebFilteredImage
          uri={currentMedia.uri}
          filters={activeFilters}
          width={screenWidth - 32}
          height={(screenWidth - 32) * 0.75}
        />
      ) : (
        <FilteredImage
          uri={currentMedia.uri}
          filters={activeFilters}
          width={screenWidth - 32}
          height={(screenWidth - 32) * 0.75}
        />
      )}
    </View>
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
        {AVAILABLE_FILTERS.map(filter => {
          const isActive = activeFilters.some(f => f.id === filter.id);
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterButton, isActive && styles.filterButtonActive]}
              onPress={() => handleFilterToggle(filter.id)}
            >
              <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <ScrollView style={styles.filterSliders} showsVerticalScrollIndicator={false}>
        {activeFilters.map(filter => (
          <FilterSlider
            key={filter.id}
            filter={filter}
            onValueChange={(value) => {
              console.log('Slider value changed:', filter.id, value);
              handleFilterValueChange(filter.id, value);
            }}
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
    paddingTop: 50, // 네비게이션 바 높이만큼 패딩 추가
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  saveButton: {
    padding: 8,
  },
  mediaContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    maxHeight: 300,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    flex: 1,
    padding: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  filterButtons: {
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.text,
  },
  filterSliders: {
    flex: 1,
  },
}); 