import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Chip, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/id';

const TOPICS = [
  'Perubahan Iklim',
  'Energi Terbarukan',
  'Gaya Hidup Berkelanjutan',
  'Konservasi Air',
  'Pengelolaan Sampah',
];

const POST_TYPES = [
  { id: 'activity', label: 'Kegiatan', icon: 'account-group' },
  { id: 'virtual', label: 'Virtual Meeting', icon: 'video' },
];

const CreatePostScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedType, setSelectedType] = useState('activity');
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  // Mengambil data profil dari route params
  const profileData = route.params?.profileData || {};
  const username = profileData?.name || 'Nama Pengguna';
  const userProfileImage = profileData?.profileImage;

  // Jika ini adalah mode edit, ambil data postingan yang akan diedit
  const editPost = route.params?.editPost;
  const isEditMode = !!editPost;

  // Inisialisasi form dengan data yang ada jika dalam mode edit
  useEffect(() => {
    if (isEditMode) {
      setTitle(editPost.title);
      setDescription(editPost.description);
      setSelectedTopic(editPost.topic);
      setSelectedType(editPost.type);
      setImage(editPost.image);
      if (editPost.type === 'virtual') {
        setMeetingLink(editPost.meetingLink);
        setMaxParticipants(editPost.maxParticipants.toString());
        setDate(new Date(editPost.date));
        setTime(new Date(`${editPost.date}T${editPost.time}`));
      }
    }
  }, [editPost]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Maaf', 'Kami membutuhkan izin untuk mengakses galeri foto');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = () => {
    if (!title || !description || !selectedTopic) {
      Alert.alert('Error', 'Mohon lengkapi judul, deskripsi, dan topik');
      return;
    }

    if (selectedType === 'virtual' && (!meetingLink || !maxParticipants)) {
      Alert.alert('Error', 'Mohon lengkapi link meeting dan jumlah maksimal peserta');
      return;
    }

    // Pastikan pengguna sudah mengisi profil
    if (!profileData?.name) {
      Alert.alert(
        'Profil Belum Lengkap',
        'Mohon lengkapi profil Anda terlebih dahulu sebelum membuat postingan.',
        [
          {
            text: 'Lengkapi Profil',
            onPress: () => navigation.navigate('EditProfile', { profileData }),
          },
          {
            text: 'Batal',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    const newPost = {
      id: isEditMode ? editPost.id : Date.now().toString(),
      title,
      description,
      topic: selectedTopic,
      type: selectedType,
      date: moment(date).format('YYYY-MM-DD'),
      time: selectedType === 'virtual' ? moment(time).format('HH:mm') : null,
      image,
      meetingLink: selectedType === 'virtual' ? meetingLink : null,
      maxParticipants: selectedType === 'virtual' ? parseInt(maxParticipants) : null,
      username: username,
      profileImage: userProfileImage,
      likes: isEditMode ? editPost.likes : 0,
      isLiked: isEditMode ? editPost.isLiked : false,
      participants: 0,
      speaker: username,
      isMySession: true
    };

    console.log('Creating new post:', newPost);

    // Tampilkan alert sukses sebelum navigasi
    Alert.alert(
      'Sukses',
      selectedType === 'virtual' ? 'Sesi virtual berhasil dibuat' : 'Postingan berhasil dibuat',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigasi kembali ke SharingScreen dengan data postingan baru
            const params = {
              newPost,
              profileData,
              isEdit: isEditMode,
              forceUpdate: Date.now(),
              showMeetings: selectedType === 'virtual'
            };
            console.log('Navigating with params:', params);
            navigation.navigate('Sharing', params);
          }
        }
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
        <Text style={styles.headerTitle}>Buat Postingan Baru</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Tipe Postingan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipe Postingan</Text>
          <View style={styles.postTypeContainer}>
            {POST_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.postTypeButton,
                  selectedType === type.id && styles.selectedPostType,
                ]}
                onPress={() => setSelectedType(type.id)}>
                <Icon
                  name={type.icon}
                  size={24}
                  color={selectedType === type.id ? '#FFFFFF' : '#2E7D32'}
                />
                <Text
                  style={[
                    styles.postTypeText,
                    selectedType === type.id && styles.selectedPostTypeText,
                  ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Judul */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Judul</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Masukkan judul postingan"
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

        {/* Upload Foto */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Foto Kegiatan</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Icon name="camera-plus" size={40} color="#2E7D32" />
                <Text style={styles.uploadText}>Upload Foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {selectedType === 'virtual' && (
          <>
            {/* Tanggal dan Waktu untuk Virtual Meeting */}
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

            {/* Link Meeting */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Link Meeting</Text>
              <TextInput
                style={styles.input}
                value={meetingLink}
                onChangeText={setMeetingLink}
                placeholder="Masukkan link virtual meeting"
              />
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
          </>
        )}

        {/* Deskripsi */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Jelaskan detail kegiatan Anda"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Tombol Buat Postingan */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePost}>
          <Text style={styles.createButtonText}>Buat Postingan</Text>
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
  postTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  postTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
    gap: 8,
  },
  selectedPostType: {
    backgroundColor: '#2E7D32',
  },
  postTypeText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedPostTypeText: {
    color: '#FFFFFF',
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
  imageUpload: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: '#2E7D32',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    marginBottom: 32,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatePostScreen;
