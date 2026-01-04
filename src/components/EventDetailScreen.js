import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import * as Sharing from 'expo-sharing';

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const handleRegister = () => {
    Alert.alert(
      'Daftar Acara',
      'Apakah Anda yakin ingin mendaftar untuk acara ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Daftar',
          onPress: () => {
            Alert.alert('Sukses', 'Anda telah berhasil mendaftar untuk acara ini!');
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        const message = `${event.title}\nTanggal: ${moment(event.date).format('DD MMM YYYY, HH:mm')}\nLokasi: ${event.location}\n\n${event.description}`;
        
        // Gunakan Share API dari Expo
        await Sharing.shareAsync(message, {
          mimeType: 'text/plain',
          dialogTitle: event.title
        });
      } else {
        Alert.alert('Error', 'Sharing tidak tersedia di perangkat ini');
      }
    } catch (error) {
      console.log('Error sharing:', error);
      Alert.alert('Error', 'Gagal membagikan acara');
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Dihapus dari Favorit' : 'Ditambahkan ke Favorit',
      isSaved ? 'Acara telah dihapus dari daftar favorit Anda' : 'Acara telah ditambahkan ke daftar favorit Anda',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/event.jpg')}
          style={styles.eventImage}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Icon name="calendar-outline" size={24} color="#2E7D32" />
              <Text style={styles.infoText}>
                {moment(event.date).format('DD MMM YYYY, HH:mm')}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="location-outline" size={24} color="#2E7D32" />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="people-outline" size={24} color="#2E7D32" />
              <Text style={styles.infoText}>{event.organizer}</Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="call-outline" size={24} color="#2E7D32" />
              <Text style={styles.infoText}>{event.contact}</Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Deskripsi Acara</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={toggleSave}>
          <Icon
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#2E7D32"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Daftar Sekarang</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  eventImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#424242',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  registerButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#2E7D32',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventDetailScreen;

