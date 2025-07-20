import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { MediaItem } from '../components/MediaItem';
import { COLORS, GRADIENTS } from '../constants/colors';
import { MediaItem as MediaItemType } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { mediaItems, loading, error, refreshMedia } = useMediaLibrary();
  const [selectedItems, setSelectedItems] = useState<MediaItemType[]>([]);

  const handleItemPress = (item: MediaItemType) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleEditPress = () => {
    if (selectedItems.length > 0) {
      navigation.navigate('Editor', { mediaItems: selectedItems });
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>LimeFilter</Text>
      <Text style={styles.subtitle}>디지털 미디어 저작 도구</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.emptyText}>미디어 파일이 없습니다</Text>
      <Text style={styles.emptySubtext}>갤러리에서 사진이나 비디오를 선택해주세요</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[
          styles.editButton,
          selectedItems.length === 0 && styles.editButtonDisabled
        ]}
        onPress={handleEditPress}
        disabled={selectedItems.length === 0}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          style={styles.editButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.text} />
          <Text style={styles.editButtonText}>
            편집하기 ({selectedItems.length})
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {renderHeader()}
      
      <FlatList
        data={mediaItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MediaItem
            item={item}
            onPress={handleItemPress}
            selected={selectedItems.some(selected => selected.id === item.id)}
          />
        )}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        onRefresh={refreshMedia}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
      />
      
      {renderFooter()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
  },
  editButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonDisabled: {
    opacity: 0.5,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  editButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 