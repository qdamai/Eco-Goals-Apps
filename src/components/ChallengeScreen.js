import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';

// Sample challenge data
const challengeData = [
  {
    id: 1,
    title: 'Tantangan 7 Hari Tanpa AC',
    category: 'Penghematan Energi',
    difficulty: 'Sedang',
    duration: '7 hari',
    description: 'Kurangi penggunaan AC selama seminggu untuk hemat energi dan kurangi emisi karbon.',
    progress: 0,
    participants: 156,
    icon: 'thermometer-outline',
    steps: [
      {
        id: 1,
        title: 'Persiapan',
        description: 'Siapkan peralatan dan dokumentasi awal:\n• Foto meteran listrik\n• Catat suhu ruangan\n• Siapkan kipas angin alternatif\n• Atur ventilasi ruangan',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Implementasi Hari 1-3',
        description: 'Mulai mengurangi penggunaan AC:\n• Foto suhu ruangan pagi dan sore\n• Dokumentasikan pengaturan ventilasi\n• Catat penggunaan kipas alternatif',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Evaluasi Tengah',
        description: 'Evaluasi progress di hari ke-4:\n• Foto meteran listrik terbaru\n• Dokumentasikan perubahan suhu\n• Catat penghematan energi',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Implementasi Hari 5-7',
        description: 'Lanjutkan tantangan:\n• Foto aktivitas pengganti AC\n• Dokumentasikan kondisi ruangan\n• Catat adaptasi yang dilakukan',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 2,
    title: 'Tantangan Nol Sampah',
    category: 'Pengurangan Sampah',
    difficulty: 'Sulit',
    duration: '30 hari',
    description: 'Hindari menghasilkan sampah selama sebulan dengan meminimalkan kemasan sekali pakai.',
    progress: 0,
    participants: 89,
    icon: 'trash-outline',
    steps: [
      {
        id: 1,
        title: 'Persiapan',
        description: 'Siapkan peralatan ramah lingkungan:\n• Foto kondisi sampah saat ini\n• Siapkan wadah reusable\n• Buat daftar alternatif kemasan\n• Dokumentasikan peralatan zero waste',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Minggu Pertama',
        description: 'Mulai mengurangi sampah:\n• Foto belanja tanpa kemasan\n• Dokumentasikan penggunaan wadah reusable\n• Catat jumlah sampah yang berkurang',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Evaluasi Tengah Bulan',
        description: 'Evaluasi progress di hari ke-15:\n• Foto perbandingan sampah\n• Dokumentasikan perubahan kebiasaan\n• Catat tantangan yang dihadapi',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Minggu Terakhir',
        description: 'Finalisasi tantangan:\n• Foto hasil akhir sampah\n• Dokumentasikan tips sukses\n• Catat total pengurangan sampah',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 3,
    title: 'Tantangan Hemat Air 30 Hari',
    category: 'Konservasi Air',
    difficulty: 'Mudah',
    duration: '30 hari',
    description: 'Kurangi penggunaan air harian dengan mengubah kebiasaan sehari-hari dan menggunakan air secara bijak.',
    progress: 0,
    participants: 234,
    icon: 'water-outline',
    steps: [
      {
        id: 1,
        title: 'Persiapan',
        description: 'Dokumentasi awal:\n• Foto meteran air\n• Identifikasi area pemborosan\n• Siapkan alat penghemat air\n• Catat penggunaan normal',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Minggu Pertama',
        description: 'Implementasi hemat air:\n• Foto penggunaan air efisien\n• Dokumentasikan metode penghematan\n• Catat perubahan kebiasaan',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Evaluasi Tengah',
        description: 'Cek progress di hari ke-15:\n• Foto meteran air terbaru\n• Dokumentasikan hasil penghematan\n• Catat tantangan yang dihadapi',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Finalisasi',
        description: 'Evaluasi akhir:\n• Foto perbandingan meteran\n• Dokumentasikan tips sukses\n• Catat total penghematan air',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 4,
    title: 'Tantangan Berkebun Mini',
    category: 'Keanekaragaman Hayati',
    difficulty: 'Mudah',
    duration: '90 hari',
    description: 'Mulai berkebun di rumah dengan menanam sayuran, buah, atau tanaman herbal untuk mendukung keanekaragaman hayati.',
    progress: 0,
    participants: 178,
    icon: 'leaf-outline',
    steps: [
      {
        id: 1,
        title: 'Persiapan Kebun',
        description: 'Siapkan area dan peralatan:\n• Foto lokasi kebun\n• Dokumentasikan persiapan media tanam\n• Foto bibit/benih yang akan ditanam\n• Siapkan alat berkebun',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Penanaman',
        description: 'Mulai menanam:\n• Foto proses penanaman\n• Dokumentasikan pengaturan jarak tanam\n• Catat tanggal penanaman\n• Foto hasil penanaman awal',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Perawatan Bulan 1-2',
        description: 'Monitoring pertumbuhan:\n• Foto perkembangan mingguan\n• Dokumentasikan proses penyiraman\n• Catat kendala dan solusi\n• Foto hama/penyakit jika ada',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Panen',
        description: 'Hasil akhir:\n• Foto hasil panen\n• Dokumentasikan proses panen\n• Catat jumlah hasil\n• Foto perbandingan sebelum-sesudah',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 5,
    title: 'Tantangan Transportasi Ramah Lingkungan',
    category: 'Aksi Iklim',
    difficulty: 'Sedang',
    duration: '14 hari',
    description: 'Gunakan transportasi ramah lingkungan seperti sepeda, berjalan kaki, atau transportasi umum selama 2 minggu.',
    progress: 0,
    participants: 145,
    icon: 'bicycle-outline',
    steps: [
      {
        id: 1,
        title: 'Perencanaan Rute',
        description: 'Persiapan transportasi:\n• Foto rute yang akan ditempuh\n• Dokumentasikan alat transportasi\n• Catat jarak tempuh harian\n• Foto persiapan peralatan',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Minggu Pertama',
        description: 'Implementasi awal:\n• Foto perjalanan harian\n• Dokumentasikan waktu tempuh\n• Catat emisi yang dihemat\n• Foto penggunaan transportasi umum',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Evaluasi Tengah',
        description: 'Cek progress:\n• Foto odometer/aplikasi tracking\n• Dokumentasikan tantangan\n• Catat pelajaran yang didapat\n• Foto rute alternatif',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Minggu Kedua',
        description: 'Finalisasi:\n• Foto perjalanan terakhir\n• Dokumentasikan total jarak\n• Catat total penghematan emisi\n• Foto testimoni pengalaman',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 6,
    title: 'Tantangan Edukasi Lingkungan',
    category: 'Edukasi',
    difficulty: 'Mudah',
    duration: '7 hari',
    description: 'Bagikan pengetahuan tentang lingkungan kepada minimal 7 orang dalam 7 hari.',
    progress: 0,
    participants: 92,
    icon: 'book-outline',
    steps: [
      {
        id: 1,
        title: 'Persiapan Materi',
        description: 'Siapkan konten edukasi:\n• Foto materi edukasi\n• Dokumentasikan sumber informasi\n• Catat target audiens\n• Foto media pembelajaran',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Implementasi Hari 1-3',
        description: 'Mulai edukasi:\n• Foto sesi berbagi pertama\n• Dokumentasikan respons audiens\n• Catat pertanyaan yang muncul\n• Foto interaksi pembelajaran',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Evaluasi Tengah',
        description: 'Cek progress:\n• Foto dokumentasi edukasi\n• Catat feedback peserta\n• Dokumentasikan metode efektif\n• Foto sesi tanya jawab',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Finalisasi',
        description: 'Evaluasi akhir:\n• Foto sesi terakhir\n• Dokumentasikan total peserta\n• Catat dampak edukasi\n• Foto testimoni peserta',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 7,
    title: 'Tantangan Belanja Berkelanjutan',
    category: 'Gaya Hidup Berkelanjutan',
    difficulty: 'Sedang',
    duration: '30 hari',
    description: 'Belanja dengan membawa tas sendiri dan pilih produk ramah lingkungan selama sebulan.',
    progress: 0,
    participants: 167,
    icon: 'bag-handle-outline',
    steps: [
      {
        id: 1,
        title: 'Persiapan Peralatan',
        description: 'Siapkan kebutuhan:\n• Foto tas belanja reusable\n• Dokumentasikan wadah reusable\n• Foto daftar produk ramah lingkungan\n• Catat toko target',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Minggu Pertama',
        description: 'Mulai belanja berkelanjutan:\n• Foto proses belanja\n• Dokumentasikan produk pilihan\n• Catat penghematan plastik\n• Foto penggunaan tas reusable',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Evaluasi Tengah',
        description: 'Cek progress:\n• Foto koleksi belanja\n• Dokumentasikan tantangan\n• Catat tips berbelanja\n• Foto perbandingan sampah',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Finalisasi',
        description: 'Evaluasi akhir:\n• Foto total penggunaan tas\n• Dokumentasikan hasil\n• Catat total penghematan\n• Foto testimoni pengalaman',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 8,
    title: 'Tantangan Dapur Hemat Energi',
    category: 'Penghematan Energi',
    difficulty: 'Sulit',
    duration: '14 hari',
    description: 'Optimalkan penggunaan energi di dapur dengan memasak hemat energi dan mengurangi penggunaan alat elektronik.',
    progress: 0,
    participants: 123,
    icon: 'flame-outline',
    steps: [
      {
        id: 1,
        title: 'Audit Dapur',
        description: 'Evaluasi penggunaan energi:\n• Foto peralatan dapur\n• Dokumentasikan meteran listrik\n• Catat penggunaan normal\n• Foto area optimasi',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Implementasi Awal',
        description: 'Mulai hemat energi:\n• Foto metode memasak\n• Dokumentasikan penggunaan alat\n• Catat waktu memasak\n• Foto makanan hasil',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Evaluasi Tengah',
        description: 'Cek progress:\n• Foto meteran baru\n• Dokumentasikan perubahan\n• Catat penghematan\n• Foto tips memasak',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Finalisasi',
        description: 'Hasil akhir:\n• Foto perbandingan meteran\n• Dokumentasikan metode terbaik\n• Catat total penghematan\n• Foto resep hemat energi',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 9,
    title: 'Tantangan Kompos Rumahan',
    category: 'Pengolahan Sampah',
    difficulty: 'Sedang',
    duration: '30 hari',
    description: 'Buat kompos dari sampah organik rumah tangga untuk mengurangi sampah dan menghasilkan pupuk alami.',
    progress: 0,
    participants: 89,
    icon: 'leaf-outline',
    steps: [
      {
        id: 1,
        title: 'Persiapan Komposter',
        description: 'Siapkan alat dan bahan:\n• Foto wadah komposter\n• Dokumentasikan bahan organik\n• Siapkan aktivator kompos\n• Catat jenis sampah organik',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Proses Awal',
        description: 'Mulai pengomposan:\n• Foto lapisan pertama\n• Dokumentasikan proses pencampuran\n• Catat suhu kompos\n• Foto kondisi kelembaban',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Monitoring',
        description: 'Pemantauan mingguan:\n• Foto perubahan warna\n• Dokumentasikan pembalikan\n• Catat perubahan tekstur\n• Foto perkembangan kompos',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Panen Kompos',
        description: 'Hasil akhir:\n• Foto kompos matang\n• Dokumentasikan proses pemanenan\n• Catat hasil kompos\n• Foto penggunaan kompos',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 10,
    title: 'Tantangan Energi Surya Mini',
    category: 'Energi Terbarukan',
    difficulty: 'Sulit',
    duration: '14 hari',
    description: 'Implementasikan penggunaan energi surya skala kecil untuk kebutuhan rumah tangga.',
    progress: 0,
    participants: 45,
    icon: 'sunny-outline',
    steps: [
      {
        id: 1,
        title: 'Perencanaan',
        description: 'Persiapan sistem:\n• Foto lokasi panel\n• Dokumentasikan peralatan\n• Catat kebutuhan daya\n• Foto kondisi awal',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Instalasi',
        description: 'Pemasangan sistem:\n• Foto proses instalasi\n• Dokumentasikan koneksi\n• Catat spesifikasi alat\n• Foto hasil pemasangan',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Pengujian',
        description: 'Uji sistem:\n• Foto pengukuran daya\n• Dokumentasikan penggunaan\n• Catat efisiensi\n• Foto aplikasi nyata',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Evaluasi',
        description: 'Hasil penggunaan:\n• Foto perbandingan tagihan\n• Dokumentasikan penghematan\n• Catat kendala\n• Foto manfaat sistem',
        completed: false,
        requiresPhoto: true
      }
    ]
  },
  {
    id: 11,
    title: 'Tantangan Diet Plastik',
    category: 'Gaya Hidup Berkelanjutan',
    difficulty: 'Sedang',
    duration: '21 hari',
    description: 'Kurangi penggunaan plastik sekali pakai dalam kehidupan sehari-hari.',
    progress: 0,
    participants: 156,
    icon: 'trash-bin-outline',
    steps: [
      {
        id: 1,
        title: 'Audit Plastik',
        description: 'Evaluasi penggunaan:\n• Foto sampah plastik\n• Dokumentasikan jenis plastik\n• Catat jumlah harian\n• Foto alternatif pengganti',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 2,
        title: 'Implementasi',
        description: 'Mulai pengurangan:\n• Foto produk alternatif\n• Dokumentasikan kebiasaan baru\n• Catat tantangan\n• Foto solusi kreatif',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 3,
        title: 'Evaluasi Tengah',
        description: 'Cek progress:\n• Foto perbandingan sampah\n• Dokumentasikan perubahan\n• Catat penghematan\n• Foto dampak positif',
        completed: false,
        requiresPhoto: true
      },
      {
        id: 4,
        title: 'Hasil Akhir',
        description: 'Evaluasi keseluruhan:\n• Foto hasil akhir\n• Dokumentasikan tips sukses\n• Catat total pengurangan\n• Foto gaya hidup baru',
        completed: false,
        requiresPhoto: true
      }
    ]
  }
];

const categories = [
  'Semua',
  'Penghematan Energi',
  'Pengurangan Sampah',
  'Konservasi Air',
  'Keanekaragaman Hayati',
  'Gaya Hidup Berkelanjutan',
  'Aksi Iklim',
  'Edukasi',
];

const difficulties = ['Semua', 'Mudah', 'Sedang', 'Sulit'];

const ChallengeCard = ({ challenge, onPress }) => (
  <TouchableOpacity style={styles.challengeCard} onPress={onPress}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Icon name={challenge.icon} size={24} color="#2E7D32" />
      </View>
      <View style={styles.headerInfo}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{challenge.category}</Text>
          </View>
          <View style={[styles.tag, styles.difficultyTag]}>
            <Text style={styles.tagText}>{challenge.difficulty}</Text>
          </View>
        </View>
      </View>
    </View>

    <Text style={styles.description} numberOfLines={2}>
      {challenge.description}
    </Text>

    <View style={styles.cardFooter}>
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={challenge.progress}
          width={120}
          color="#2E7D32"
          unfilledColor="#E0E0E0"
          borderWidth={0}
        />
        <Text style={styles.progressText}>
          {Math.round(challenge.progress * 100)}%
        </Text>
      </View>
      <View style={styles.participants}>
        <Icon name="people-outline" size={16} color="#424242" />
        <Text style={styles.participantsText}>
          {challenge.participants} peserta
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const FilterButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.filterButtonActive]}
    onPress={onPress}>
    <Text
      style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const ChallengeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [activeDifficulty, setActiveDifficulty] = useState('Semua');
  const [photos, setPhotos] = useState({});

  const handleTakePhoto = async (challengeId, stepId) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Diperlukan', 'Aplikasi membutuhkan akses kamera untuk fitur ini');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Add photo preview
        const photoUri = result.assets[0].uri;
        setPhotos(prev => ({
          ...prev,
          [`${challengeId}-${stepId}`]: photoUri
        }));
        Alert.alert('Sukses', 'Foto berhasil disimpan sebagai bukti tantangan');
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Gagal mengambil foto');
    }
  };

  const handleDeletePhoto = (challengeId, stepId) => {
    setPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[`${challengeId}-${stepId}`];
      return newPhotos;
    });
  };


  const filteredChallenges = challengeData.filter(challenge => {
    if (activeCategory !== 'Semua' && challenge.category !== activeCategory) {
      return false;
    }
    if (activeDifficulty !== 'Semua' && challenge.difficulty !== activeDifficulty) {
      return false;
    }
    if (searchQuery) {
      return challenge.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tantangan Lingkungan</Text>
      </View>

      <View style={styles.searchAndFilterContainer}>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#424242" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari tantangan..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#757575"
          />
        </View>

        <View style={styles.filtersWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContentContainer}>
            {categories.map((category) => (
              <FilterButton
                key={category}
                title={category}
                active={activeCategory === category}
                onPress={() => setActiveCategory(category)}
              />
            ))}
          </ScrollView>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.difficultyContainer}
            contentContainerStyle={styles.filterContentContainer}>
            {difficulties.map((difficulty) => (
              <FilterButton
                key={difficulty}
                title={difficulty}
                active={activeDifficulty === difficulty}
                onPress={() => setActiveDifficulty(difficulty)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView 
        style={styles.challengeList}
        showsVerticalScrollIndicator={false}>
        {filteredChallenges.map((challenge) => (
          <ChallengeCard 
            key={challenge.id} 
            challenge={challenge} 
            onPress={() => {
              navigation.navigate('ChallengeDetailScreen', { 
                challenge: {
                  ...challenge,
                  benefits: challenge.benefits || [],
                  photos: {}
                }
              });
            }} 
          />
        ))}
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
  searchAndFilterContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
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
  filtersWrapper: {
    marginBottom: 4,
  },
  filterContainer: {
    maxHeight: 40,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  filterContentContainer: {
    alignItems: 'center',
  },
  difficultyContainer: {
    maxHeight: 40,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    color: '#424242',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  challengeList: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#81C784',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#81C784',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  difficultyTag: {
    backgroundColor: '#FFEB3B',
  },
  tagText: {
    fontSize: 12,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#424242',
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#424242',
  },
  photoSection: {
    marginTop: 12,
  },
  photoPreviewContainer: {
    marginTop: 8,
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
  },
  photoButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default ChallengeScreen;

