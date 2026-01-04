import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Chip, FAB, Searchbar, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer';
import moment from 'moment';

const SAMPLE_FEEDS = [
  {
    id: 'sample_feed_1',
    username: 'EcoWarrior',
    title: 'Kegiatan Bersih Pantai',
    description: 'Hari ini kami melakukan pembersihan pantai bersama komunitas.',
    date: '2024-01-20',
    image: null,
    likes: 45,
    topic: 'Gaya Hidup Berkelanjutan',
    isLiked: false,
    type: 'activity',
  },
  {
    id: 'sample_feed_2',
    username: 'GreenActivist',
    title: 'Workshop Daur Ulang',
    description: 'Berbagi pengetahuan tentang daur ulang sampah plastik.',
    date: '2024-01-22',
    image: null,
    likes: 32,
    topic: 'Pengelolaan Sampah',
    isLiked: true,
    type: 'activity',
  },
  {
    id: 'sample_feed_3',
    username: 'WaterGuardian',
    title: 'Konservasi Sumber Air',
    description: 'Kegiatan penanaman pohon di sekitar sumber mata air untuk menjaga keberlangsungan air bersih.',
    date: '2024-01-23',
    image: null,
    likes: 67,
    topic: 'Konservasi Air',
    isLiked: false,
    type: 'activity',
  },
  {
    id: 'sample_feed_4',
    username: 'SolarPioneer',
    title: 'Instalasi Panel Surya Komunitas',
    description: 'Proyek pemasangan panel surya untuk penerangan jalan di desa.',
    date: '2024-01-24',
    image: null,
    likes: 89,
    topic: 'Energi Terbarukan',
    isLiked: false,
    type: 'activity',
  },
  {
    id: 'sample_feed_5',
    username: 'ClimateHero',
    title: 'Aksi Penanaman Mangrove',
    description: 'Menanam 1000 bibit mangrove untuk mengurangi dampak perubahan iklim.',
    date: '2024-01-25',
    image: null,
    likes: 120,
    topic: 'Perubahan Iklim',
    isLiked: false,
    type: 'activity',
  }
];

const SAMPLE_MEETINGS = [
  {
    id: 'sample_meeting_1',
    title: 'Perubahan Iklim di Indonesia',
    speaker: 'Dr. Lingkungan',
    date: '2024-01-20',
    time: '14:00',
    participants: 45,
    maxParticipants: 100,
    topic: 'Perubahan Iklim',
    meetingLink: 'https://zoom.us/j/example',
    type: 'virtual',
    description: 'Diskusi mendalam tentang dampak perubahan iklim di Indonesia',
    isMySession: false
  },
  {
    id: 'sample_meeting_2',
    title: 'Energi Terbarukan untuk Masa Depan',
    speaker: 'Ing. Sustainable',
    date: '2024-01-22',
    time: '15:30',
    participants: 32,
    maxParticipants: 50,
    topic: 'Energi Terbarukan',
    meetingLink: 'https://zoom.us/j/example2',
    type: 'virtual',
    description: 'Membahas potensi energi terbarukan di Indonesia',
    isMySession: false
  },
  {
    id: 'sample_meeting_3',
    title: 'Teknologi Pengolahan Air Modern',
    speaker: 'Prof. Aqua',
    date: '2024-01-25',
    time: '10:00',
    participants: 28,
    maxParticipants: 75,
    topic: 'Konservasi Air',
    meetingLink: 'https://zoom.us/j/example3',
    type: 'virtual',
    description: 'Inovasi dalam teknologi pengolahan dan konservasi air',
    isMySession: false
  },
  {
    id: 'sample_meeting_4',
    title: 'Zero Waste Lifestyle',
    speaker: 'Green Expert',
    date: '2024-01-27',
    time: '13:00',
    participants: 55,
    maxParticipants: 80,
    topic: 'Gaya Hidup Berkelanjutan',
    meetingLink: 'https://zoom.us/j/example4',
    type: 'virtual',
    description: 'Tips dan trik menjalani gaya hidup tanpa sampah',
    isMySession: false
  },
  {
    id: 'sample_meeting_5',
    title: 'Inovasi Daur Ulang Plastik',
    speaker: 'Waste Manager',
    date: '2024-01-29',
    time: '16:00',
    participants: 40,
    maxParticipants: 60,
    topic: 'Pengelolaan Sampah',
    meetingLink: 'https://zoom.us/j/example5',
    type: 'virtual',
    description: 'Teknologi terbaru dalam pengolahan sampah plastik',
    isMySession: false
  }
];

const initialMeetings = [];

const TOPICS = [
  'Perubahan Iklim',
  'Energi Terbarukan',
  'Gaya Hidup Berkelanjutan',
  'Konservasi Air',
  'Pengelolaan Sampah',
];

export default function SharingScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('feeds');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [feeds, setFeeds] = useState(SAMPLE_FEEDS);
  const [meetings, setMeetings] = useState(SAMPLE_MEETINGS);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [likeScale] = useState(new Animated.Value(1));
  const [tabIndicatorAnim] = useState(new Animated.Value(0));
  const [topicScaleAnim] = useState(new Animated.Value(1));

  // Mengambil data profil pengguna yang sedang login
  const currentUser = route.params?.profileData?.name || 'Nama Pengguna';
  const currentUserProfile = route.params?.profileData;

  // Effect untuk menangani postingan baru
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.newPost) {
        const { newPost, isEdit, forceUpdate, showMeetings } = route.params;
        console.log('Received new post data:', newPost);
        
        if (showMeetings) {
          setActiveTab('meetings');
        }

        if (newPost.type === 'activity') {
          if (isEdit) {
            setFeeds(prevFeeds => 
              prevFeeds.map(feed => 
                feed.id === newPost.id ? { ...newPost, isMyPost: true } : feed
              )
            );
          } else {
            const uniqueId = `user_feed_${Date.now()}`;
            const newFeed = {
              ...newPost,
              id: uniqueId,
              isMyPost: true,
              likes: 0,
              isLiked: false,
              date: moment().format('YYYY-MM-DD')
            };
            setFeeds(prevFeeds => [newFeed, ...prevFeeds]);
            console.log('Added new feed:', newFeed);
          }
        } else if (newPost.type === 'virtual') {
          if (isEdit) {
            setMeetings(prevMeetings => 
              prevMeetings.map(meeting => 
                meeting.id === newPost.id ? { ...newPost, isMySession: true } : meeting
              )
            );
          } else {
            const uniqueId = `user_meeting_${Date.now()}`;
            const newMeeting = {
              ...newPost,
              id: uniqueId,
              isMySession: true,
              participants: 0,
              speaker: currentUser,
              profileImage: currentUserProfile?.profileImage
            };
            setMeetings(prevMeetings => [newMeeting, ...prevMeetings]);
            console.log('Added new meeting:', newMeeting);
          }
        }

        navigation.setParams({ 
          newPost: null,
          forceUpdate: null,
          showMeetings: null
        });
      }
    }, [route.params?.newPost, currentUser, currentUserProfile])
  );

  // Debug state changes
  useEffect(() => {
    console.log('Current feeds count:', feeds.length);
    console.log('Current meetings count:', meetings.length);
  }, [feeds, meetings]);

  // Fungsi untuk menghapus postingan
  const handleDeletePost = (postId) => {
    Alert.alert(
      'Hapus Postingan',
      'Apakah Anda yakin ingin menghapus postingan ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => {
            setFeeds(prevFeeds => prevFeeds.filter(feed => feed.id !== postId));
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Fungsi untuk menghapus sesi
  const handleDeleteMeeting = (meetingId) => {
    Alert.alert(
      'Hapus Sesi',
      'Apakah Anda yakin ingin menghapus sesi virtual ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => {
            setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.id !== meetingId));
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Filter berdasarkan topik dan pencarian
  const filteredFeeds = feeds.filter(feed => {
    const matchTopic = !selectedTopic || feed.topic === selectedTopic;
    const matchSearch = !searchQuery || 
      feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feed.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTopic && matchSearch;
  });

  const filteredMeetings = meetings.filter(meeting => {
    const matchTopic = !selectedTopic || meeting.topic === selectedTopic;
    const matchSearch = !searchQuery || 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTopic && matchSearch;
  });

  const handleTabChange = (tab) => {
    // Animasi indikator tab
    Animated.timing(tabIndicatorAnim, {
      toValue: tab === 'feeds' ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setActiveTab(tab);
  };

  const handleTopicSelect = (topic) => {
    // Animasi scale untuk chip yang dipilih
    Animated.sequence([
      Animated.timing(topicScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(topicScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedTopic(selectedTopic === topic ? '' : topic);
  };

  const handleJoinMeeting = (meeting) => {
    if (meeting.participants >= meeting.maxParticipants) {
      Alert.alert('Maaf', 'Sesi ini sudah penuh');
      return;
    }

    setSelectedMeeting(meeting);
    setEmailModalVisible(true);
  };

  const handleSendEmail = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      Alert.alert('Error', 'Mohon masukkan email yang valid');
      return;
    }

    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (isAvailable) {
        const emailContent = {
          recipients: [emailInput],
          subject: `Link Meeting: ${selectedMeeting.title}`,
          body: `
Halo!

Terima kasih telah bergabung dengan sesi virtual "${selectedMeeting.title}".

Detail Meeting:
- Tanggal: ${selectedMeeting.date}
- Waktu: ${selectedMeeting.time}
- Pembicara: ${selectedMeeting.speaker}
- Topik: ${selectedMeeting.topic}

Link Zoom Meeting:
${selectedMeeting.meetingLink}

Sampai jumpa di sesi!

Salam,
Tim EcoGoals`,
        };

        await MailComposer.composeAsync(emailContent);

        // Update jumlah peserta
        setMeetings(prevMeetings =>
          prevMeetings.map(m => {
            if (m.id === selectedMeeting.id) {
              return {
                ...m,
                participants: m.participants + 1,
              };
            }
            return m;
          })
        );

        Alert.alert(
          'Sukses',
          'Link meeting telah dikirim ke email Anda. Silakan cek inbox Anda.'
        );
        setEmailModalVisible(false);
        setEmailInput('');
        setSelectedMeeting(null);
      } else {
        Alert.alert(
          'Error',
          'Tidak dapat mengirim email. Pastikan Anda telah mengatur email di perangkat Anda.'
        );
      }
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat mengirim email. Silakan coba lagi.'
      );
    }
  };

  const handleEditPost = (post) => {
    navigation.navigate('CreatePost', { 
      profileData: route.params?.profileData,
      editPost: post 
    });
  };

  const handleEditMeeting = (meeting) => {
    navigation.navigate('CreateSession', { 
      profileData: route.params?.profileData,
      editMeeting: meeting 
    });
  };

  const handleLike = (feedId) => {
    // Animasi ketika tombol like ditekan
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Update state feeds
    setFeeds(prevFeeds =>
      prevFeeds.map(feed => {
        if (feed.id === feedId) {
          return {
            ...feed,
            likes: feed.isLiked ? feed.likes - 1 : feed.likes + 1,
            isLiked: !feed.isLiked,
          };
        }
        return feed;
      })
    );

    // Tampilkan feedback
    if (!feeds.find(f => f.id === feedId)?.isLiked) {
      Alert.alert('Sukses', 'Anda menyukai postingan ini!', [{ text: 'OK' }], {
        cancelable: true,
      });
    }
  };

  const renderFeed = ({ item }) => (
    <Card style={styles.feedCard}>
      <Card.Content>
        <View style={styles.feedHeader}>
          <View style={styles.userInfo}>
            {item.profileImage ? (
              <Image 
                source={{ uri: item.profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <Icon name="account-circle" size={40} color="#2E7D32" />
            )}
            <View style={styles.userTextInfo}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.feedDate}>{item.date}</Text>
              {item.isMyPost && (
                <View style={styles.myPostLabel}>
                  <Icon name="check-circle" size={12} color="#2E7D32" />
                  <Text style={styles.myPostText}>Postingan Saya</Text>
                </View>
              )}
            </View>
          </View>
          {item.isMyPost && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditPost(item)}
              >
                <Icon name="pencil" size={20} color="#2E7D32" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeletePost(item.id)}
              >
                <Icon name="delete" size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Chip 
          style={styles.topicChipInCard}
          textStyle={styles.topicChipTextInCard}
        >
          {item.topic}
        </Chip>
        <Text style={styles.feedTitle}>{item.title}</Text>
        <Text style={styles.feedDescription}>{item.description}</Text>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.feedImage} />
        )}
        <View style={styles.feedActions}>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => handleLike(item.id)}
          >
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Icon 
                name={item.isLiked ? "heart" : "heart-outline"} 
                size={24} 
                color={item.isLiked ? "#E91E63" : "#424242"} 
              />
            </Animated.View>
            <Text style={styles.likeCount}>{item.likes}</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderMeeting = ({ item }) => (
    <Card style={styles.meetingCard}>
      <Card.Content>
        <View style={styles.meetingHeader}>
          <View style={styles.meetingHeaderLeft}>
            <Icon name="video" size={24} color="#2E7D32" />
            <Text style={styles.participantsText}>
              {item.participants}/{item.maxParticipants} Peserta
            </Text>
          </View>
          {item.isMySession && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditMeeting(item)}
              >
                <Icon name="pencil" size={20} color="#2E7D32" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeleteMeeting(item.id)}
              >
                <Icon name="delete" size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.meetingTitle}>{item.title}</Text>
        <View style={styles.meetingDetails}>
          <View style={styles.detailItem}>
            <Icon name="account" size={16} color="#424242" />
            <Text style={styles.detailText}>{item.speaker}</Text>
            {item.isMySession && (
              <View style={styles.myPostLabel}>
                <Icon name="check-circle" size={12} color="#2E7D32" />
                <Text style={styles.myPostText}>Sesi Saya</Text>
              </View>
            )}
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color="#424242" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="clock" size={16} color="#424242" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>
        <Chip 
          style={styles.topicChipInCard}
          textStyle={styles.topicChipTextInCard}
        >
          {item.topic}
        </Chip>
        <Button
          mode="contained"
          onPress={() => handleJoinMeeting(item)}
          style={styles.joinButton}
          labelStyle={[
            styles.joinButtonText,
            item.isMySession && styles.mySessionButtonText
          ]}
          disabled={item.participants >= item.maxParticipants || item.isMySession}
        >
          {item.isMySession ? 'Sesi Anda' : 
            item.participants >= item.maxParticipants ? 'Sesi Penuh' : 'Bergabung ke Sesi'}
        </Button>
      </Card.Content>
    </Card>
  );

  const handleCreatePost = () => {
    const profileData = route.params?.profileData;
    navigation.navigate('CreatePost', { profileData });
  };

  const handleCreateMeeting = () => {
    const profileData = route.params?.profileData;
    setActiveTab('meetings'); // Pastikan tab meetings aktif
    navigation.navigate('CreateSession', { profileData });
  };

  const renderSession = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => navigation.navigate('SessionDetail', { session: item })}>
      <View style={styles.sessionContent}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <Text style={styles.sessionInfo}>
          {`${item.speaker} • ${moment(item.date).format('DD MMM YYYY')} • ${item.time}`}
        </Text>
        <View style={styles.participantsInfo}>
          <Icon name="account-group" size={20} color="#2E7D32" />
          <Text style={styles.participantsText}>
            {`${item.participants}/${item.maxParticipants} Peserta`}
          </Text>
        </View>
        {item.isMySession && (
          <View style={styles.mySessionBadge}>
            <Text style={styles.mySessionText}>Sesi Saya</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sharing Session</Text>
        <Text style={styles.headerSubtitle}>
          Berbagi pengetahuan untuk bumi yang lebih baik
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab]}
          onPress={() => handleTabChange('feeds')}
        >
          <Text style={[styles.tabText, activeTab === 'feeds' && styles.activeTabText]}>
            Feeds
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab]}
          onPress={() => handleTabChange('meetings')}
        >
          <Text style={[styles.tabText, activeTab === 'meetings' && styles.activeTabText]}>
            Virtual Meeting
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              transform: [{
                translateX: tabIndicatorAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 150] // Sesuaikan dengan lebar tab
                })
              }]
            }
          ]}
        />
      </View>

      <Searchbar
        placeholder={activeTab === 'feeds' ? "Cari feeds..." : "Cari sesi virtual..."}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#2E7D32"
      />

      <View style={styles.filterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsScrollContainer}
      >
          <Chip
            selected={!selectedTopic}
            onPress={() => handleTopicSelect('')}
            style={[
              styles.topicChip,
              !selectedTopic && styles.selectedTopicChip,
            ]}
          >
            <Animated.View style={{ transform: [{ scale: topicScaleAnim }] }}>
              <Text style={[
                styles.topicText,
                !selectedTopic && styles.selectedTopicText,
              ]}>
                Semua
              </Text>
            </Animated.View>
          </Chip>
        {TOPICS.map((topic) => (
          <Chip
            key={topic}
            selected={selectedTopic === topic}
              onPress={() => handleTopicSelect(topic)}
            style={[
              styles.topicChip,
              selectedTopic === topic && styles.selectedTopicChip,
            ]}
            textStyle={[
              styles.topicText,
              selectedTopic === topic && styles.selectedTopicText,
            ]}
          >
            {topic}
          </Chip>
        ))}
      </ScrollView>
      </View>

      <FlatList
        data={activeTab === 'feeds' ? filteredFeeds : filteredMeetings}
        renderItem={activeTab === 'feeds' ? renderFeed : renderMeeting}
        keyExtractor={(item) => item.id}
        style={styles.contentList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Icon name="alert-circle-outline" size={48} color="#757575" />
            <Text style={styles.emptyStateText}>
              {selectedTopic 
                ? `Tidak ada ${activeTab === 'feeds' ? 'postingan' : 'sesi'} untuk topik "${selectedTopic}"`
                : `Belum ada ${activeTab === 'feeds' ? 'postingan' : 'sesi'}`}
            </Text>
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => {
          setEmailModalVisible(false);
          setEmailInput('');
          setSelectedMeeting(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bergabung ke Sesi</Text>
            <Text style={styles.modalSubtitle}>
              Masukkan email Anda untuk menerima link meeting
            </Text>
            <TextInput
              style={styles.emailInput}
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="Masukkan email Anda"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setEmailModalVisible(false);
                  setEmailInput('');
                  setSelectedMeeting(null);
                }}
                style={styles.modalButton}
              >
                Batal
              </Button>
              <Button
                mode="contained"
                onPress={handleSendEmail}
                style={[styles.modalButton, styles.sendButton]}
              >
                Kirim
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <FAB
        style={styles.fab}
        icon={activeTab === 'feeds' ? "plus" : "video-plus"}
        color="#FFFFFF"
        onPress={activeTab === 'feeds' ? handleCreatePost : handleCreateMeeting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 16,
    color: '#757575',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  searchBar: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  topicsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  topicChip: {
    marginRight: 8,
    backgroundColor: '#F5F5F5',
    height: 36,
    borderRadius: 18,
    elevation: 0,
    borderWidth: 0,
  },
  selectedTopicChip: {
    backgroundColor: '#E8F5E9',
    elevation: 0,
    borderWidth: 0,
  },
  topicText: {
    color: '#757575',
    fontSize: 13,
    fontWeight: '500',
  },
  selectedTopicText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  contentList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  feedCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextInfo: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  feedDate: {
    fontSize: 12,
    color: '#757575',
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  feedDescription: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 12,
  },
  feedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  feedActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  likeCount: {
    marginLeft: 4,
    color: '#424242',
  },
  meetingCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantsText: {
    marginLeft: 8,
    color: '#2E7D32',
    fontSize: 14,
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  meetingDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#424242',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2E7D32',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  myPostLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  myPostText: {
    fontSize: 10,
    color: '#2E7D32',
    marginLeft: 4,
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  topicsScrollContainer: {
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicChip: {
    marginRight: 8,
    backgroundColor: '#F5F5F5',
    height: 36,
    borderRadius: 18,
    elevation: 0,
    borderWidth: 0,
  },
  selectedTopicChip: {
    backgroundColor: '#E8F5E9',
    elevation: 0,
    borderWidth: 0,
  },
  topicText: {
    color: '#757575',
    fontSize: 13,
    fontWeight: '500',
  },
  selectedTopicText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    marginTop: 8,
    color: '#757575',
    fontSize: 14,
    textAlign: 'center',
  },
  joinButton: {
    marginTop: 12,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mySessionButtonText: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#2E7D32',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  meetingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sessionContent: {
    flexDirection: 'column',
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  sessionInfo: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participantsText: {
    marginLeft: 8,
    color: '#2E7D32',
    fontSize: 14,
  },
  mySessionBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  mySessionText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '500',
  },
  topicChipInCard: {
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
    borderWidth: 0,
    height: 32,
    alignSelf: 'flex-start',
    borderRadius: 16,
  },
  topicChipTextInCard: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 12,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#2E7D32',
  },
});

