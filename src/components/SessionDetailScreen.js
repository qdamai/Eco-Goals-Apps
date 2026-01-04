


import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import 'moment/locale/id';

const SessionDetailScreen = ({ route, navigation }) => {
  const { session } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header dengan tombol kembali */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Sesi</Text>
        </View>

        {/* Informasi utama sesi */}
        <View style={styles.content}>
          <Text style={styles.title}>{session.title}</Text>
          
          <View style={styles.speakerInfo}>
            <Icon name="account" size={24} color="#2E7D32" />
            <Text style={styles.speakerName}>{session.speaker}</Text>
          </View>

          {/* Detail waktu dan peserta */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Icon name="calendar" size={20} color="#424242" />
              <Text style={styles.detailText}>
                {moment(session.date).locale('id').format('DD MMMM YYYY')}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Icon name="clock-outline" size={20} color="#424242" />
              <Text style={styles.detailText}>{session.time}</Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="account-group" size={20} color="#424242" />
              <Text style={styles.detailText}>{session.participants} Peserta</Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="star" size={20} color="#FFEB3B" />
              <Text style={styles.detailText}>{session.rating}</Text>
            </View>
          </View>

          {/* Deskripsi sesi */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Deskripsi Sesi</Text>
            <Text style={styles.descriptionText}>
              Sesi berbagi ini akan membahas tentang {session.title.toLowerCase()} 
              secara mendalam. Para peserta akan mendapatkan pemahaman yang 
              komprehensif tentang topik ini dan bagaimana menerapkannya dalam 
              kehidupan sehari-hari.
            </Text>
          </View>

          {/* Tombol bergabung */}
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Bergabung ke Sesi</Text>
          </TouchableOpacity>
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
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#212121',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  speakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  speakerName: {
    fontSize: 16,
    color: '#2E7D32',
    marginLeft: 8,
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#424242',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#424242',
  },
  joinButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SessionDetailScreen;