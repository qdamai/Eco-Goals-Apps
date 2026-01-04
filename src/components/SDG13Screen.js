import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const Section = ({ title, content, icon }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={24} color="#2E7D32" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const SDG13Screen = ({ navigation }) => {
  const sections = [
    {
      title: 'Definisi SDG 13',
      content: 'SDG 13 bertujuan untuk mengambil tindakan segera dalam memerangi perubahan iklim dan dampaknya. Ini merupakan salah satu tujuan global yang paling kritis dalam upaya menjaga keberlanjutan planet kita.',
      icon: 'earth-outline',
    },
    {
      title: 'Pentingnya SDG 13',
      content: 'Perubahan iklim mempengaruhi setiap aspek kehidupan kita. Dampaknya terasa pada ekosistem, kesehatan manusia, dan ekonomi global. Mengatasi perubahan iklim sangat penting untuk menjamin masa depan yang berkelanjutan.',
      icon: 'alert-circle-outline',
    },
    {
      title: 'Target dan Indikator',
      content: 'Target utama meliputi pengurangan emisi gas rumah kaca, peningkatan adaptasi terhadap perubahan iklim, dan penguatan ketahanan terhadap bencana iklim. Kemajuan diukur melalui berbagai indikator spesifik.',
      icon: 'target-outline',
    },
    {
      title: 'Tindakan Mitigasi dan Adaptasi',
      content: 'Mitigasi fokus pada pengurangan penyebab perubahan iklim, seperti penggunaan energi terbarukan. Adaptasi melibatkan penyesuaian terhadap dampak yang ada, seperti pembangunan infrastruktur tahan bencana.',
      icon: 'shield-checkmark-outline',
    },
    {
      title: 'Peran Masyarakat dan Pemerintah',
      content: 'Kolaborasi antara pemerintah, sektor swasta, dan masyarakat sipil sangat penting. Kerjasama internasional diperlukan untuk mengatasi tantangan global ini.',
      icon: 'people-outline',
    },
    {
      title: 'Edukasi dan Kesadaran',
      content: 'Meningkatkan kesadaran dan pengetahuan masyarakat tentang perubahan iklim sangat penting. Program edukasi dan kampanye kesadaran perlu dilakukan di berbagai tingkatan.',
      icon: 'book-outline',
    },
    {
      title: 'Keberlanjutan dan Masa Depan',
      content: 'Pencapaian SDG 13 akan membantu menciptakan masa depan yang lebih berkelanjutan dan adil. Tantangan yang ada perlu diatasi dengan komitmen bersama.',
      icon: 'leaf-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SDG 13: Penanganan Perubahan Iklim</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Image
            source={require('../assets/13.png')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Icon name="earth" size={40} color="#FFFFFF" />
            <Text style={styles.bannerText}>Climate Action</Text>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <Section
              key={index}
              title={section.title}
              content={section.content}
              icon={section.icon}
            />
          ))}
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
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  banner: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sectionsContainer: {
    padding: 16,
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
});

export default SDG13Screen;

