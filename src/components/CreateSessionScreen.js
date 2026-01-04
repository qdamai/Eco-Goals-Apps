import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Chip } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/id';

const TOPICS = [
  'Perubahan Iklim',
  'Energi Terbarukan',
  'Gaya Hidup Berkelanjutan',
  'Konservasi Air',
  'Pengelolaan Sampah',
];

const CreateSessionScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState('');

  const handleCreateSession = () => {
    if (!title || !description || !selectedTopic || !maxParticipants) {
      Alert.alert('Error', 'Mohon lengkapi semua data');
      return;
    }

    // Ambil data profil dari route params
    const profileData = route.params?.profileData || {};
    const username = profileData?.name || 'Nama Pengguna';

    const newPost = {
      id: Date.now().toString(),
      title,
      description,
      topic: selectedTopic,
      date: moment(date).format('YYYY-MM-DD'),
      time: moment(time).format('HH:mm'),
      participants: 0,
      maxParticipants: parseInt(maxParticipants),
      username: username,
      speaker: username,
      type: 'virtual',
      isMySession: true,
      meetingLink: 'https://zoom.us/j/example',
      profileImage: profileData?.profileImage
    };

    Alert.alert(
      'Sukses',
      'Sesi berhasil dibuat!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigasi ke Sharing screen dengan data sesi baru
            navigation.navigate('Sharing', { 
              newPost,
              profileData,
              showMeetings: true,
              forceUpdate: Date.now()
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Sesi Baru</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Judul Sesi */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Judul Sesi</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Masukkan judul sesi"
          />
        </View>

        {/* Topik */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pilih Topik</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TOPICS.map((topic) => (
              <Chip
                key={topic}
                selected={selectedTopic === topic}
                onPress={() => setSelectedTopic(topic)}
                style={[
                  styles.topicChip,
                  selectedTopic === topic && styles.selectedTopicChip,
                ]}>
                {topic}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Tanggal dan Waktu */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tanggal dan Waktu</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimePicker}
              onPress={() => setShowDatePicker(true)}>
              <Icon name="calendar" size={20} color="#2E7D32" />
              <Text style={styles.dateTimeText}>
                {moment(date).format('DD MMMM YYYY')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimePicker}
              onPress={() => setShowTimePicker(true)}>
              <Icon name="clock-outline" size={20} color="#2E7D32" />
              <Text style={styles.dateTimeText}>
                {moment(time).format('HH:mm')}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}
        </View>

        {/* Jumlah Maksimal Peserta */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jumlah Maksimal Peserta</Text>
          <TextInput
            style={styles.input}
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            placeholder="Masukkan jumlah maksimal peserta"
            keyboardType="numeric"
          />
        </View>

        {/* Deskripsi */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Jelaskan detail sesi Anda"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Tombol Buat Sesi */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateSession}>
          <Text style={styles.createButtonText}>Buat Sesi</Text>
        </TouchableOpacity>
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
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#212121',
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#424242',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  topicChip: {
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedTopicChip: {
    backgroundColor: '#81C784',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  dateTimeText: {
    marginLeft: 8,
    color: '#424242',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateSessionScreen;
