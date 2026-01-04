import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ route, navigation }) => {
  const profileData = route.params?.profileData || {};

  const handleSave = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          params: {
            profileData: {
              name: profileData.name,
              email: profileData.email,
              environmentalGoals: profileData.environmentalGoals,
              profileImage: profileData.profileImage
            }
          }
        }
      ]
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfileScreen', profileData)}>
            <Icon name="create-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileImageContainer}>
          {profileData.profileImage ? (
            <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Icon name="person-outline" size={40} color="#FFFFFF" />
            </View>
          )}
          <Text style={styles.name}>{profileData.name || 'Nama Pengguna'}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Icon name="mail-outline" size={20} color="#2E7D32" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{profileData.email || '-'}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <Icon name="leaf-outline" size={20} color="#2E7D32" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tujuan Lingkungan</Text>
                <Text style={styles.infoValue}>
                  {profileData.environmentalGoals || '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>

              

        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                              <Text style={styles.saveButtonText}>Lanjutkan ke Beranda</Text>
                            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'flex-end',
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  saveButtonText: {
    color: '#ffffff',
    padding: 8,
    borderRadius: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#81C784',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#81C784',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 15,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 'auto',
  },
  continueButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ProfileScreen;

