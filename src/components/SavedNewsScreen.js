import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/id';

// Define NewsCard component locally
const NewsCard = ({ item, onPress, onSave, isSaved }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity style={styles.newsCard} onPress={() => onPress(item)}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/logomix.png')}
          style={styles.newsImage}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        {imageLoading && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="small" color="#2E7D32" />
          </View>
        )}
      </View>
      <View style={styles.newsContent}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.newsInfo}>
          <Text style={styles.newsSource}>{item.source}</Text>
          <Text style={styles.newsDate}>
            {moment(item.date).locale('id').fromNow()}
          </Text>
        </View>
        <View style={styles.newsStats}>
          <View style={styles.statItem}>
            <Icon name="heart-outline" size={16} color="#424242" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="chatbubble-outline" size={16} color="#424242" />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(item)}>
            <Icon
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color="#2E7D32"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SavedNewsScreen = ({ navigation }) => {
  const [savedNews, setSavedNews] = useState([]);

  useEffect(() => {
    loadSavedNews();
  }, []);

  const loadSavedNews = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedNews');
      if (saved) {
        setSavedNews(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved news:', error);
    }
  };

  const handleRemove = async (newsId) => {
    try {
      const updatedSavedNews = savedNews.filter((item) => item.id !== newsId);
      setSavedNews(updatedSavedNews);
      await AsyncStorage.setItem('savedNews', JSON.stringify(updatedSavedNews));
      Alert.alert('Berhasil', 'Berita telah dihapus dari daftar simpanan');
    } catch (error) {
      console.error('Error removing news:', error);
      Alert.alert('Error', 'Gagal menghapus berita');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Berita Tersimpan</Text>
      </View>

      <ScrollView style={styles.newsList}>
        {savedNews.length > 0 ? (
          savedNews.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              onPress={() => {
                console.log('Navigating to NewsDetail with:', item);
                navigation.navigate('NewsDetail', { news: item });
              }}
              onSave={() => handleRemove(item.id)}
              isSaved={true}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="bookmark-outline" size={48} color="#81C784" />
            <Text style={styles.emptyStateText}>
              Belum ada berita yang disimpan
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 12,
  },
  newsList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#424242',
    marginTop: 8,
  },
  // NewsCard styles
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    height: 120,
  },
  imageContainer: {
    width: 120,
    height: '100%',
  },
  newsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  newsContent: {
    flex: 1,
    padding: 12,
  },
  categoryTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  categoryText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '500',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
    lineHeight: 18,
  },
  newsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  newsSource: {
    fontSize: 12,
    color: '#757575',
  },
  newsDate: {
    fontSize: 12,
    color: '#757575',
  },
  newsStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#757575',
  },
  saveButton: {
    marginLeft: 'auto',
    padding: 4,
  },
});

export default SavedNewsScreen;

