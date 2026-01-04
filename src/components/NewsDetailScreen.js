import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/id';

const NewsDetailScreen = ({ route, navigation }) => {
  const { news } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/logomix.png')}
          style={styles.newsImage}
        />

        <View style={styles.content}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{news.category}</Text>
          </View>

          <Text style={styles.title}>{news.title}</Text>

          <View style={styles.newsInfo}>
            <Text style={styles.source}>{news.source}</Text>
            <Text style={styles.date}>
              {moment(news.date).locale('id').format('DD MMMM YYYY')}
            </Text>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Icon name="heart-outline" size={20} color="#424242" />
              <Text style={styles.statText}>{news.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="chatbubble-outline" size={20} color="#424242" />
              <Text style={styles.statText}>{news.comments}</Text>
            </View>
          </View>

          <Text style={styles.contentText}>{news.content}</Text>
        </View>
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
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  newsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  categoryTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    lineHeight: 32,
  },
  newsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  source: {
    fontSize: 14,
    color: '#424242',
  },
  date: {
    fontSize: 14,
    color: '#757575',
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
  contentText: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default NewsDetailScreen;

