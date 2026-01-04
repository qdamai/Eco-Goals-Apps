import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';

const categories = [
  {
    id: 1,
    name: 'Rumah',
    icon: 'home-outline',
    color: '#81C784',
  },
  {
    id: 2,
    name: 'Transportasi',
    icon: 'car-outline',
    color: '#2E7D32',
  },
  {
    id: 3,
    name: 'Makanan',
    icon: 'restaurant-outline',
    color: '#FFEB3B',
  },
  {
    id: 4,
    name: 'Gaya Hidup',
    icon: 'leaf-outline',
    color: '#424242',
  },
];

const tips = {
  Rumah: [
    {
      id: 1,
      title: 'Hemat Energi di Rumah',
      description: 'Matikan lampu dan peralatan elektronik saat tidak digunakan',
      impact: 'Menghemat 10% listrik per bulan',
      points: 50,
      completed: false,
    },
    {
      id: 2,
      title: 'Penggunaan AC yang Bijak',
      description: 'Atur suhu AC pada 24-25°C dan gunakan timer',
      impact: 'Menghemat 15% energi AC',
      points: 40,
      completed: false,
    },
    {
      id: 3,
      title: 'Manajemen Sampah Rumah Tangga',
      description: 'Pisahkan sampah organik dan anorganik',
      impact: 'Mengurangi sampah ke TPA sebesar 30%',
      points: 60,
      completed: false,
    },
    {
      id: 4,
      title: 'Hemat Air',
      description: 'Perbaiki kebocoran dan gunakan air bekas untuk menyiram tanaman',
      impact: 'Menghemat 20% penggunaan air',
      points: 45,
      completed: false,
    },
    {
      id: 5,
      title: 'Pencahayaan Alami',
      description: 'Maksimalkan penggunaan cahaya matahari di siang hari',
      impact: 'Mengurangi penggunaan lampu 40%',
      points: 35,
      completed: false,
    }
  ],
  Transportasi: [
    {
      id: 1,
      title: 'Gunakan Transportasi Umum',
      description: 'Pilih transportasi umum untuk perjalanan harian',
      impact: 'Mengurangi emisi karbon 2kg per hari',
      points: 100,
      completed: false,
    },
    {
      id: 2,
      title: 'Sepeda untuk Jarak Dekat',
      description: 'Gunakan sepeda untuk perjalanan jarak dekat',
      impact: 'Mengurangi emisi dan meningkatkan kesehatan',
      points: 80,
      completed: false,
    },
    {
      id: 3,
      title: 'Perawatan Kendaraan Rutin',
      description: 'Lakukan servis rutin dan cek tekanan ban',
      impact: 'Mengoptimalkan efisiensi bahan bakar 15%',
      points: 60,
      completed: false,
    },
    {
      id: 4,
      title: 'Car Pooling',
      description: 'Berbagi kendaraan dengan rekan kerja atau tetangga',
      impact: 'Mengurangi jumlah kendaraan di jalan',
      points: 75,
      completed: false,
    },
    {
      id: 5,
      title: 'Eco-Driving',
      description: 'Praktikkan cara mengemudi yang hemat energi',
      impact: 'Menghemat BBM hingga 20%',
      points: 70,
      completed: false,
    }
  ],
  Makanan: [
    {
      id: 1,
      title: 'Kurangi Food Waste',
      description: 'Rencanakan belanja dan kelola stok makanan dengan baik',
      impact: 'Mengurangi 30% sampah makanan',
      points: 65,
      completed: false,
    },
    {
      id: 2,
      title: 'Beli Produk Lokal',
      description: 'Pilih bahan makanan dari petani lokal',
      impact: 'Mengurangi jejak karbon transportasi',
      points: 55,
      completed: false,
    },
    {
      id: 3,
      title: 'Kompos Sisa Makanan',
      description: 'Olah sisa makanan menjadi kompos',
      impact: 'Mengurangi sampah organik 40%',
      points: 70,
      completed: false,
    },
    {
      id: 4,
      title: 'Diet Rendah Karbon',
      description: 'Kurangi konsumsi daging dan tingkatkan konsumsi nabati',
      impact: 'Mengurangi emisi dari produksi makanan',
      points: 85,
      completed: false,
    },
    {
      id: 5,
      title: 'Kemasan Ramah Lingkungan',
      description: 'Pilih produk dengan kemasan minimal atau dapat didaur ulang',
      impact: 'Mengurangi sampah plastik',
      points: 60,
      completed: false,
    }
  ],
  'Gaya Hidup': [
    {
      id: 1,
      title: 'Zero Waste Challenge',
      description: 'Mulai gaya hidup tanpa sampah selama sebulan',
      impact: 'Mengurangi 90% sampah rumah tangga',
      points: 120,
      completed: false,
    },
    {
      id: 2,
      title: 'Berkebun Mini',
      description: 'Tanam sayuran dan bumbu dapur sendiri',
      impact: 'Menyediakan pangan organik',
      points: 90,
      completed: false,
    },
    {
      id: 3,
      title: 'Belanja Berkelanjutan',
      description: 'Gunakan tas belanja sendiri dan hindari plastik sekali pakai',
      impact: 'Mengurangi sampah plastik 50%',
      points: 75,
      completed: false,
    },
    {
      id: 4,
      title: 'Digital Over Paper',
      description: 'Minimalisir penggunaan kertas dengan digitalisasi',
      impact: 'Menyelamatkan pohon dan mengurangi sampah',
      points: 65,
      completed: false,
    },
    {
      id: 5,
      title: 'Reduce-Reuse-Recycle',
      description: 'Terapkan prinsip 3R dalam kehidupan sehari-hari',
      impact: 'Mengurangi sampah ke TPA 60%',
      points: 100,
      completed: false,
    }
  ]
};

const TipsScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('Rumah');
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState(0.3);
  const [totalPoints, setTotalPoints] = useState(450);
  const [carbonSaved, setCarbonSaved] = useState([20, 45, 28, 80, 99, 43]);

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: carbonSaved,
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const renderCategoryButtons = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            activeCategory === category.name && styles.categoryButtonActive,
          ]}
          onPress={() => setActiveCategory(category.name)}>
          <Icon
            name={category.icon}
            size={24}
            color={activeCategory === category.name ? '#FFFFFF' : '#2E7D32'}
          />
          <Text
            style={[
              styles.categoryButtonText,
              activeCategory === category.name && styles.categoryButtonTextActive,
            ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTipCard = (tip) => (
    <TouchableOpacity
      key={tip.id}
      style={styles.tipCard}
      onPress={() => toggleTipCompletion(tip)}>
      <View style={styles.tipHeader}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <View style={styles.pointsBadge}>
          <Icon name="star" size={16} color="#FFEB3B" />
          <Text style={styles.pointsText}>{tip.points}</Text>
        </View>
      </View>
      <Text style={styles.tipDescription}>{tip.description}</Text>
      <View style={styles.tipImpact}>
        <Icon name="trending-up" size={20} color="#2E7D32" />
        <Text style={styles.impactText}>{tip.impact}</Text>
      </View>
      <View style={styles.completionContainer}>
        <Progress.Bar
          progress={tip.completed ? 1 : 0}
          width={200}
          color="#2E7D32"
          unfilledColor="#E0E0E0"
        />
        <Text style={styles.completionText}>
          {tip.completed ? 'Selesai' : 'Belum Selesai'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const toggleTipCompletion = (tip) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda sudah menerapkan tip ini?',
      [
        {
          text: 'Belum',
          style: 'cancel',
        },
        {
          text: 'Sudah',
          onPress: () => {
            // Update tip completion status
            tip.completed = true;
            // Update progress
            setProgress(progress + 0.1);
            // Update total points
            setTotalPoints(prevPoints => prevPoints + tip.points);
            Alert.alert('Berhasil', `Selamat! Anda mendapatkan ${tip.points} poin!`);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tips Eco-Friendly</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#424242" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari tips..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#757575"
        />
      </View>

      {renderCategoryButtons()}

      <View style={styles.pointsSummaryContainer}>
        <View style={styles.pointsCard}>
          <View style={styles.pointsValueContainer}>
            <Icon name="star" size={28} color="#FFEB3B" />
            <Text style={styles.totalPointsValue}>{totalPoints}</Text>
          </View>
          <Text style={styles.totalPointsText}>Total Poin</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Dampak Positif</Text>
          <LineChart
            data={data}
            width={screenWidth - 32}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.tipsSection}>
          {tips[activeCategory]?.map(renderTipCard)}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    height: 36,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom:-550,
    height: 1,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#2E7D32',
    height: 28,
  },
  categoryButtonActive: {
    backgroundColor: '#2E7D32',
  },
  categoryButtonText: {
    marginLeft: 2,
    fontSize: 11,
    color: '#2E7D32',
    marginRight: 2,
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: -4,
  },
  tipsSection: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000000',
  },
  tipDescription: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
  },
  tipImpact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2E7D32',
  },
  completionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completionText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#757575',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 12,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  totalPointsText: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '500',
  },
  totalPointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 4,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '500',
    marginTop: 4,
  },
  chartContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 8,
  },
  pointsSummaryContainer: {
    paddingHorizontal: 16,
    marginTop: 0,
    marginBottom: 8,
  },
  pointsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pointsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  totalPointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 8,
  },
  totalPointsText: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
});

export default TipsScreen;

