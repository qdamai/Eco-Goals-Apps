import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/id';

// Sample news data
const newsData = [
  {
    id: 1,
    title: 'Upaya Baru dalam Mengatasi Perubahan Iklim Global',
    category: 'Perubahan Iklim',
    source: 'Environmental News',
    date: '2024-01-08',
    content: `Dalam upaya terbaru mengatasi perubahan iklim global, sebuah inisiatif internasional telah diluncurkan yang melibatkan lebih dari 50 negara. Program ini menggabungkan teknologi mutakhir dan kerjasama lintas negara untuk mengurangi emisi karbon secara signifikan.

Beberapa poin utama dari inisiatif ini meliputi:

1. Pengembangan Teknologi Hijau
- Investasi besar-besaran dalam energi terbarukan
- Pengembangan sistem penyimpanan energi yang lebih efisien
- Implementasi teknologi penangkapan karbon terbaru

2. Kerjasama Internasional
- Pembentukan tim peneliti lintas negara
- Program pertukaran teknologi ramah lingkungan
- Standarisasi pengukuran emisi karbon global

3. Target Konkret
- Pengurangan emisi karbon 50% pada tahun 2030
- Penanaman 1 miliar pohon dalam 5 tahun
- Transisi ke energi terbarukan 100% pada tahun 2050

Para ahli menyatakan bahwa inisiatif ini merupakan langkah penting dalam memerangi perubahan iklim. Dr. Sarah Johnson, seorang klimatolog terkemuka, mengatakan "Ini adalah pertama kalinya kita melihat komitmen global yang begitu komprehensif dengan target dan timeline yang jelas."

Program ini juga akan melibatkan sektor swasta dan masyarakat umum melalui berbagai program edukasi dan insentif untuk mendorong gaya hidup ramah lingkungan.`,
    likes: 245,
    comments: 89,
    image: require('../assets/logomix.png')
  },
  {
    id: 2,
    title: 'Inovasi Teknologi Ramah Lingkungan',
    category: 'Teknologi',
    source: 'Tech Environment',
    date: '2024-01-07',
    content: `Terobosan baru dalam teknologi ramah lingkungan telah berhasil dikembangkan oleh tim peneliti dari Institut Teknologi Hijau. Mereka berhasil menciptakan sistem yang dapat mengkonversi sampah plastik menjadi bahan bakar berkualitas tinggi dengan dampak lingkungan minimal.

Proses Inovatif:
1. Pengolahan Sampah Plastik
- Pemilahan otomatis menggunakan AI
- Proses pembersihan ramah lingkungan
- Penggunaan energi terbarukan dalam prosesnya

2. Teknologi Konversi
- Menggunakan katalis khusus yang dapat didaur ulang
- Proses berlangsung pada suhu rendah untuk menghemat energi
- Zero waste system yang mengolah semua hasil sampingan

3. Hasil dan Manfaat
- Bahan bakar berkualitas tinggi
- Pengurangan sampah plastik hingga 90%
- Emisi karbon yang jauh lebih rendah

Dr. Ahmad Wijaya, kepala peneliti, menjelaskan "Teknologi ini bukan hanya mengubah sampah plastik menjadi bahan bakar, tapi juga memastikan seluruh prosesnya ramah lingkungan. Ini adalah solusi dua arah untuk masalah sampah plastik dan kebutuhan energi."

Teknologi ini telah melalui uji coba selama 6 bulan dan menunjukkan hasil yang sangat menjanjikan. Pemerintah dan beberapa perusahaan besar telah menunjukkan minat untuk mengimplementasikan teknologi ini dalam skala yang lebih besar.`,
    likes: 188,
    comments: 45,
    image: require('../assets/logomix.png')
  },
  {
    id: 3,
    title: 'Program Daur Ulang Plastik Nasional',
    category: 'Daur Ulang',
    source: 'Green News',
    date: '2024-01-06',
    content: `Program Daur Ulang Plastik Nasional (PDPN) telah resmi diluncurkan oleh pemerintah sebagai solusi komprehensif untuk mengatasi krisis sampah plastik di Indonesia. Program ini mengintegrasikan berbagai pemangku kepentingan, dari pemerintah hingga masyarakat umum.

Komponen Utama Program:

1. Infrastruktur Daur Ulang
- Pembangunan 100 pusat daur ulang modern di seluruh Indonesia
- Sistem pengumpulan sampah plastik terintegrasi
- Teknologi pemilahan otomatis berbasis AI

2. Edukasi dan Sosialisasi
- Program pelatihan untuk pemulung dan pekerja daur ulang
- Kampanye kesadaran masyarakat di media sosial
- Workshop daur ulang di sekolah dan komunitas

3. Insentif dan Regulasi
- Sistem reward points untuk partisipasi masyarakat
- Kebijakan pembatasan plastik sekali pakai
- Insentif pajak untuk industri daur ulang

Menurut Direktur PDPN, Ir. Bambang Sutrisno, "Target kami adalah meningkatkan tingkat daur ulang plastik nasional dari 7% menjadi 30% dalam 5 tahun ke depan. Ini adalah langkah besar menuju Indonesia bebas sampah plastik."

Program ini juga menciptakan ribuan lapangan kerja baru di sektor daur ulang dan ekonomi hijau.`,
    likes: 320,
    comments: 92,
    image: require('../assets/logomix.png')
  },
  {
    id: 4,
    title: 'Hutan Mangrove: Pelindung Pesisir dari Perubahan Iklim',
    category: 'Konservasi',
    source: 'Coastal News',
    date: '2024-01-05',
    content: `Upaya penanaman dan rehabilitasi hutan mangrove di sepanjang pesisir Indonesia menunjukkan dampak positif yang signifikan dalam melindungi wilayah pantai dari dampak perubahan iklim. Proyek yang telah berjalan selama tiga tahun ini telah berhasil mengembalikan ekosistem pesisir yang vital.

Pencapaian Program:

1. Area Rehabilitasi
- 50.000 hektar mangrove telah ditanam
- 80% tingkat keberhasilan pertumbuhan
- Pemulihan 15 ekosistem pesisir kritis

2. Manfaat Ekologis
- Pengurangan abrasi pantai hingga 60%
- Peningkatan populasi ikan pesisir
- Penyerapan karbon 5x lebih efektif dari hutan biasa

3. Dampak Sosial-Ekonomi
- Pemberdayaan nelayan lokal sebagai penjaga mangrove
- Pengembangan ekowisata mangrove
- Peningkatan pendapatan masyarakat pesisir

Prof. Dr. Ratna Sari, ahli ekologi pesisir, menyatakan "Hutan mangrove adalah benteng alami terbaik kita menghadapi perubahan iklim. Selain melindungi pesisir, mangrove juga menyediakan habitat bagi berbagai spesies dan mendukung ekonomi lokal."

Program ini menjadi model percontohan untuk rehabilitasi mangrove di negara-negara tropis lainnya.`,
    likes: 276,
    comments: 63,
    image: require('../assets/logomix.png')
  },
  {
    id: 5,
    title: 'Energi Surya Menjadi Pilihan Utama Rumah Tangga',
    category: 'Energi Terbarukan',
    source: 'Energy Today',
    date: '2024-01-04',
    content: `Tren penggunaan panel surya di perumahan Indonesia mengalami peningkatan dramatis, menandai pergeseran signifikan menuju energi terbarukan dalam skala rumah tangga. Survei terbaru menunjukkan peningkatan 300% dalam instalasi panel surya residensial selama 12 bulan terakhir.

Faktor Pendorong:

1. Inovasi Teknologi
- Panel surya generasi baru dengan efisiensi tinggi
- Sistem penyimpanan baterai yang lebih terjangkau
- Aplikasi monitoring energi pintar

2. Insentif Pemerintah
- Subsidi pembelian panel surya
- Skema cicilan khusus
- Program listrik excess ke PLN

3. Manfaat Ekonomis
- Penghematan biaya listrik hingga 70%
- Periode balik modal 3-4 tahun
- Peningkatan nilai properti

"Ini adalah revolusi energi di level grassroot," ujar Drs. Hendra Wijaya, analis energi terbarukan. "Masyarakat tidak hanya menghemat biaya, tapi juga aktif berkontribusi dalam pengurangan emisi karbon."

Diproyeksikan pada 2025, 25% rumah tangga perkotaan akan menggunakan energi surya sebagai sumber listrik utama.`,
    likes: 412,
    comments: 157,
    image: require('../assets/logomix.png')
  },
  {
    id: 6,
    title: 'Tips Mengurangi Jejak Karbon dalam Kehidupan Sehari-hari',
    category: 'Gaya Hidup',
    source: 'Eco Living',
    date: '2024-01-03',
    content: `Mengadopsi gaya hidup ramah lingkungan tidak harus rumit atau mahal. Berikut adalah panduan praktis dan efektif untuk mengurangi jejak karbon dalam aktivitas sehari-hari, yang dapat memberikan dampak signifikan pada lingkungan.

Panduan Praktis:

1. Transportasi Hijau
- Gunakan transportasi umum atau sepeda untuk perjalanan pendek
- Terapkan car pooling dengan rekan kerja
- Pertimbangkan kendaraan listrik atau hybrid

2. Efisiensi Energi di Rumah
- Ganti lampu ke LED hemat energi
- Atur suhu AC optimal (24-25°C)
- Matikan peralatan elektronik yang tidak digunakan

3. Pola Konsumsi Berkelanjutan
- Belanja dengan tas reusable
- Pilih produk lokal dan musiman
- Kurangi konsumsi daging 1-2 hari per minggu

"Perubahan kecil dalam rutinitas harian dapat memberikan dampak besar jika dilakukan secara konsisten," jelas Diana Putri, konsultan gaya hidup berkelanjutan.

Dengan menerapkan tips ini, setiap individu dapat mengurangi jejak karbon hingga 30% per tahun.`,
    likes: 189,
    comments: 73,
    image: require('../assets/logomix.png')
  },
  {
    id: 7,
    title: 'Inovasi Kemasan Ramah Lingkungan dari Bahan Alami',
    category: 'Teknologi',
    source: 'Innovation Daily',
    date: '2024-01-02',
    content: `Terobosan baru dalam dunia kemasan ramah lingkungan telah dicapai oleh tim peneliti lokal. Mereka berhasil mengembangkan kemasan biodegradable yang terbuat dari kombinasi serat tanaman dan limbah pertanian, yang dapat terurai sempurna dalam waktu 3 bulan.

Keunggulan Inovasi:

1. Bahan Baku Berkelanjutan
- Pemanfaatan limbah pertanian lokal
- Proses produksi hemat energi
- Bahan 100% dapat terurai

2. Karakteristik Produk
- Kekuatan setara plastik konvensional
- Tahan air dan panas
- Aman untuk makanan

3. Dampak Lingkungan
- Waktu penguraian 3 bulan
- Tidak menghasilkan mikroplastik
- Menjadi pupuk organik saat terurai

"Inovasi ini adalah jawaban untuk masalah sampah kemasan yang selama ini sulit diatasi," kata Dr. Rina Wijaya, kepala tim peneliti.

Beberapa perusahaan besar telah menyatakan minat untuk mengadopsi teknologi ini dalam lini produksi mereka.`,
    likes: 234,
    comments: 88,
    image: require('../assets/logomix.png')
  },
  {
    id: 8,
    title: 'Komunitas Peduli Lingkungan Inisiasi Gerakan Bebas Plastik',
    category: 'Gaya Hidup',
    source: 'Community News',
    date: '2024-01-01',
    content: `Gerakan #BersamaTanpaSampahPlastik yang diinisiasi oleh berbagai komunitas lingkungan di Indonesia telah berhasil menginspirasi ribuan rumah tangga untuk beralih ke gaya hidup bebas plastik. Gerakan ini menunjukkan bahwa perubahan besar bisa dimulai dari aksi komunitas.

Strategi Gerakan:

1. Edukasi Masyarakat
- Workshop pembuatan produk ramah lingkungan
- Kampanye media sosial #BersamaTanpaSampahPlastik
- Program edukasi di sekolah dan kampus

2. Solusi Praktis
- Pengenalan alternatif produk non-plastik
- Panduan belanja zero waste
- Tips mengolah sampah organik

3. Kolaborasi Stakeholder
- Kerjasama dengan pasar tradisional
- Dukungan pemerintah daerah
- Partisipasi pelaku usaha lokal

"Respon masyarakat sangat positif, terutama ketika mereka melihat bahwa alternatif bebas plastik sebenarnya lebih ekonomis dalam jangka panjang," ujar Anita Pratiwi, koordinator gerakan.

Dalam 6 bulan, gerakan ini telah mengurangi penggunaan plastik sekali pakai hingga 5 ton di 10 kota besar.`,
    likes: 298,
    comments: 112,
    image: require('../assets/logomix.png')
  },
  {
    id: 9,
    title: 'Penemuan Spesies Baru di Hutan Tropis Indonesia',
    category: 'Konservasi',
    source: 'Wildlife News',
    date: '2023-12-31',
    content: `Tim peneliti gabungan dari berbagai institusi telah menemukan beberapa spesies baru di kawasan hutan tropis Indonesia. Penemuan ini menegaskan pentingnya konservasi keanekaragaman hayati dan menjadi bukti bahwa masih banyak keajaiban alam yang belum terungkap.

Detail Penemuan:

1. Spesies yang Ditemukan
- 3 spesies kupu-kupu endemik
- 2 jenis katak arboreal
- 1 spesies tanaman karnivora

2. Signifikansi Ekologis
- Indikator kesehatan ekosistem
- Potensi medis dan farmakologis
- Peran dalam rantai makanan

3. Implikasi Konservasi
- Perluasan area konservasi
- Penguatan perlindungan habitat
- Program penelitian berkelanjutan

"Penemuan ini menunjukkan betapa kayanya biodiversitas Indonesia dan pentingnya melindungi habitat alami," kata Prof. Widodo, ketua tim peneliti.

Temuan ini telah dipublikasikan di jurnal internasional dan menarik perhatian komunitas ilmiah global.`,
    likes: 367,
    comments: 143,
    image: require('../assets/logomix.png')
  },
  {
    id: 10,
    title: 'Kota Hijau: Model Pembangunan Berkelanjutan',
    category: 'Perubahan Iklim',
    source: 'Urban Planning',
    date: '2023-12-30',
    content: `Konsep Kota Hijau yang mengintegrasikan ruang terbuka hijau dan infrastruktur ramah lingkungan mulai diterapkan di beberapa kota besar Indonesia. Program ini menjadi model pembangunan berkelanjutan yang menyelaraskan pembangunan dengan pelestarian lingkungan.

Komponen Utama:

1. Infrastruktur Hijau
- Taman vertikal di gedung-gedung
- Sistem drainase berkelanjutan
- Jalur sepeda dan pejalan kaki

2. Manajemen Lingkungan
- Pengolahan sampah terpadu
- Sistem transportasi rendah emisi
- Efisiensi energi gedung

3. Pemberdayaan Masyarakat
- Program urban farming
- Komunitas hijau tingkat RT/RW
- Edukasi lingkungan

"Kota hijau bukan sekadar konsep, tapi kebutuhan untuk masa depan yang lebih baik," jelas Ir. Suryanto, kepala dinas tata kota.

Implementasi tahap pertama telah menunjukkan penurunan suhu kota hingga 2°C dan peningkatan kualitas udara sebesar 35%.`,
    likes: 445,
    comments: 198,
    image: require('../assets/logomix.png')
  }
];

const categories = [
  'Semua',
  'Perubahan Iklim',
  'Polusi',
  'Konservasi',
  'Energi Terbarukan',
  'Gaya Hidup',
];

const NewsCard = ({ item, onPress, onSave, isSaved }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={styles.newsCard}>
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
        <TouchableOpacity onPress={() => onPress(item)}>
      <Text style={styles.newsTitle} numberOfLines={2}>
        {item.title}
      </Text>
        </TouchableOpacity>
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
    </View>
);
};

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

const NewsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [savedNews, setSavedNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState(newsData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await Promise.all([
        loadSavedNews(),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedNews = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedNews');
      if (saved) {
        setSavedNews(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved news:', error);
      throw error;
    }
  };

  const handleSaveNews = async (newsItem) => {
    try {
      const isAlreadySaved = savedNews.some((item) => item.id === newsItem.id);
      let updatedSavedNews;

      if (isAlreadySaved) {
        updatedSavedNews = savedNews.filter((item) => item.id !== newsItem.id);
        Alert.alert('Berhasil', 'Berita telah dihapus dari daftar simpanan');
      } else {
        updatedSavedNews = [...savedNews, newsItem];
        Alert.alert('Berhasil', 'Berita telah disimpan');
      }

      setSavedNews(updatedSavedNews);
      await AsyncStorage.setItem('savedNews', JSON.stringify(updatedSavedNews));
    } catch (error) {
      console.error('Error saving news:', error);
      Alert.alert('Error', 'Gagal menyimpan berita');
    }
  };

  const handleShare = async (newsItem) => {
    try {
      await Share.share({
        message: `${newsItem.title}\n\nBaca selengkapnya di aplikasi Eco Goals!`,
      });
    } catch (error) {
      console.error('Error sharing news:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNewsPress = (news) => {
    navigation.navigate('NewsDetail', {
      news: {
        id: news.id,
        title: news.title,
        category: news.category,
        source: news.source,
        date: news.date,
        content: news.content,
        likes: news.likes,
        comments: news.comments,
        image: require('../assets/logomix.png')
      }
    });
  };

  const filteredNews = news.filter((item) => {
    if (activeCategory !== 'Semua' && item.category !== activeCategory) {
      return false;
    }
    if (searchQuery) {
      return item.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={48} color="#FF5252" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadInitialData}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Berita Lingkungan</Text>
        <TouchableOpacity
          style={styles.savedButton}
          onPress={() => navigation.navigate('SavedNewsScreen')}>
          <Icon name="bookmark-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#424242" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berita..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#757575"
        />
      </View>

      <View style={styles.categoriesContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}>
        {categories.map((category) => (
            <TouchableOpacity
            key={category}
              style={[
                styles.filterButton,
                activeCategory === category && styles.filterButtonActive,
              ]}
              onPress={() => setActiveCategory(category)}>
              <Text
                style={[
                  styles.filterButtonText,
                  activeCategory === category && styles.filterButtonTextActive,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      <ScrollView
        style={styles.newsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2E7D32']}
          />
        }>
        {filteredNews.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            onPress={handleNewsPress}
            onSave={handleSaveNews}
            isSaved={savedNews.some((saved) => saved.id === item.id)}
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
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
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
    flex: 1,
    textAlign: 'center',
  },
  savedButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#212121',
  },
  categoriesContainer: {
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriesScroll: {
    paddingHorizontal: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
    borderWidth: 0,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  newsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NewsScreen;

