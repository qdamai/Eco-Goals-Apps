import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// Sample data for events
const eventData = [
  {
    id: 1,
    title: 'Penanaman 1000 Pohon',
    date: '2024-01-15T09:00:00',
    location: 'Taman Kota',
    category: 'Penanaman',
    description: 'Mari bergabung dalam kegiatan penanaman 1000 pohon untuk masa depan yang lebih hijau.',
    image: require('../assets/event.jpg'),
    organizer: 'Komunitas Hijau',
    contact: '+62123456789',
    participants: 45,
    maxParticipants: 100,
    isBookmarked: false,
  },
  {
    id: 2,
    title: 'Seminar Perubahan Iklim',
    date: '2024-01-20T13:00:00',
    location: 'Aula Utama',
    category: 'Seminar',
    description: 'Seminar tentang dampak perubahan iklim dan solusinya.',
    image: require('../assets/event.jpg'),
    organizer: 'Climate Action Group',
    contact: '+62987654321',
    participants: 75,
    maxParticipants: 150,
    isBookmarked: false,
  },
  // Add more events as needed
];

const EventCard = ({ event, onPress, onBookmark }) => (
  <TouchableOpacity style={styles.eventCard} onPress={onPress}>
    <Image
      source={require('../assets/event.jpg')}
      style={styles.eventImage}
    />
    <View style={styles.eventInfo}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => onBookmark(event.id)}
        >
          <Icon 
            name={event.isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color="#2E7D32" 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.eventDetail}>
        <Icon name="calendar-outline" size={16} color="#2E7D32" />
        <Text style={styles.eventDetailText}>
          {moment(event.date).format('DD MMM YYYY, HH:mm')}
        </Text>
      </View>
      <View style={styles.eventDetail}>
        <Icon name="location-outline" size={16} color="#2E7D32" />
        <Text style={styles.eventDetailText}>{event.location}</Text>
      </View>
      <View style={styles.eventDetail}>
        <Icon name="people-outline" size={16} color="#2E7D32" />
        <Text style={styles.eventDetailText}>
          {event.participants}/{event.maxParticipants} Peserta
        </Text>
      </View>
      <View style={styles.categoryTag}>
        <Text style={styles.categoryText}>{event.category}</Text>
      </View>
      {event.participants >= event.maxParticipants && (
        <View style={styles.fullTag}>
          <Text style={styles.fullTagText}>Penuh</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const FilterButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.filterButtonActive]}
    onPress={onPress}>
    <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const EventScreen = ({ navigation }) => {
  console.log('EventScreen rendered');
  
  try {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [sortBy, setSortBy] = useState('date');
    const [events, setEvents] = useState(eventData);
    const [showSortOptions, setShowSortOptions] = useState(false);

    const filters = ['Semua', 'Penanaman', 'Seminar', 'Pembersihan'];
    const sortOptions = [
      { id: 'date', label: 'Tanggal', icon: 'calendar-outline' },
      { id: 'participants', label: 'Jumlah Peserta', icon: 'people-outline' },
      { id: 'bookmarked', label: 'Disimpan', icon: 'bookmark-outline' },
    ];

    const handleBookmark = (eventId) => {
      setEvents(prevEvents => 
        prevEvents.map(event => {
          if (event.id === eventId) {
            const newBookmarkStatus = !event.isBookmarked;
            Alert.alert(
              newBookmarkStatus ? 'Disimpan' : 'Dihapus dari Simpanan',
              newBookmarkStatus 
                ? 'Event telah ditambahkan ke daftar simpanan' 
                : 'Event telah dihapus dari daftar simpanan',
              [{ text: 'OK' }]
            );
            return { ...event, isBookmarked: newBookmarkStatus };
          }
          return event;
        })
      );
    };

    const handleJoinEvent = (event) => {
      if (event.participants >= event.maxParticipants) {
        Alert.alert('Maaf', 'Event ini sudah penuh');
        return;
      }

      Alert.alert(
        'Bergabung Event',
        'Apakah Anda yakin ingin bergabung dengan event ini?',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Bergabung',
            onPress: () => {
              setEvents(prevEvents =>
                prevEvents.map(e =>
                  e.id === event.id
                    ? { ...e, participants: e.participants + 1 }
                    : e
                )
              );
              Alert.alert('Sukses', 'Anda telah berhasil bergabung dengan event ini!');
            }
          }
        ]
      );
    };

    const filteredEvents = events
      .filter(event => {
        if (activeFilter !== 'Semua' && event.category !== activeFilter) return false;
        if (searchQuery) {
          return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 event.location.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return new Date(a.date) - new Date(b.date);
          case 'participants':
            return b.participants - a.participants;
          case 'bookmarked':
            return (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0);
          default:
            return 0;
        }
      });

    console.log('Filtered events:', filteredEvents);

    const handleShare = async (event) => {
      try {
        await Share.open({
          title: event.title,
          message: `${event.title}\nTanggal: ${moment(event.date).format('DD MMM YYYY, HH:mm')}\nLokasi: ${event.location}\n\n${event.description}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    };

    if (!eventData || eventData.length === 0) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Acara Lingkungan</Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Tidak ada acara tersedia</Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('Tombol kembali ditekan');
              navigation.goBack();
            }}>
            <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Acara Lingkungan</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setShowSortOptions(!showSortOptions)}>
            <Icon name="funnel-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {showSortOptions && (
          <View style={styles.sortOptionsContainer}>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  sortBy === option.id && styles.sortOptionActive
                ]}
                onPress={() => {
                  setSortBy(option.id);
                  setShowSortOptions(false);
                }}
              >
                <Icon name={option.icon} size={20} color={sortBy === option.id ? "#FFFFFF" : "#2E7D32"} />
                <Text style={[
                  styles.sortOptionText,
                  sortBy === option.id && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#424242" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari acara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#757575"
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}>
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              title={filter}
              active={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>

        <ScrollView style={styles.eventList}>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => {
                console.log('Navigating to EventDetailScreen with event:', event);
                navigation.navigate('EventDetailScreen', { event });
              }}
              onBookmark={handleBookmark}
            />
          ))}
          {filteredEvents.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="calendar-outline" size={48} color="#BDBDBD" />
              <Text style={styles.emptyStateText}>
                Tidak ada acara yang ditemukan
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  } catch (error) {
    console.error('Error in EventScreen:', error);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Acara Lingkungan</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Terjadi kesalahan saat memuat data</Text>
        </View>
      </SafeAreaView>
    );
  }
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  filterContainer: {
    maxHeight: 40,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    height: 32,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    color: '#424242',
    fontSize: 13,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  eventList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailText: {
    marginLeft: 8,
    color: '#424242',
    fontSize: 14,
  },
  categoryTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#81C784',
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  sortButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  sortOptionsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  sortOptionActive: {
    backgroundColor: '#2E7D32',
  },
  sortOptionText: {
    marginLeft: 4,
    color: '#2E7D32',
    fontSize: 14,
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 8,
    color: '#757575',
    textAlign: 'center',
  },
  fullTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF5252',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default EventScreen;

