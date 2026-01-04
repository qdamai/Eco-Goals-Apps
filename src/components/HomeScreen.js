import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuItem = ({ icon, title, onPress }) => (
  <TouchableOpacity 
    style={styles.menuItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIcon}>
      <Icon name={icon} size={24} color="#4CAF50" />
    </View>
    <Text style={styles.menuTitle}>{title}</Text>
    <Icon name="chevron-forward" size={24} color="#757575" />
  </TouchableOpacity>
);

const HomeScreen = ({ route, navigation }) => {
  const profileData = route.params?.profileData || {};
  
  console.log('Profile Image URI:', profileData?.profileImage);

  const handleMenuPress = (screenName) => {
    console.log('Attempting to navigate to:', screenName);
    try {
      navigation.navigate(screenName, { profileData });
      console.log('Navigation successful');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', `Gagal membuka halaman ${screenName}`);
    }
  };

  const menuItems = [
    {
      icon: 'earth-outline',
      title: 'Apa itu SDG 13?',
      screen: 'SDG13Screen'
    },
    {
      icon: 'calendar-outline',
      title: 'Acara Lingkungan',
      screen: 'EventScreen'
    },
    {
      icon: 'trophy-outline',
      title: 'Tantangan lingkungan',
      screen: 'ChallengeScreen'
    },
    {
      icon: 'newspaper-outline',
      title: 'Berita Lingkungan',
      screen: 'NewsScreen'
    },
    {
      icon: 'bulb-outline',
      title: 'Tips & Trik',
      screen: 'Tips'
    },
    {
      icon: 'people-outline',
      title: 'Sharing Session',
      screen: 'Sharing'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={() => navigation.navigate('Profile', { profileData })}
        >
          {profileData?.profileImage ? (
            <Image
              source={{ uri: profileData.profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../assets/logomix.png')}
              style={styles.profileImage}
            />
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profileData?.name || 'Pengguna'}
            </Text>
            <Text style={styles.profileStatus}>
              {profileData?.environmentalGoals || 'Belum ada tujuan lingkungan'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            title={item.title}
            onPress={() => handleMenuPress(item.screen)}
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
    backgroundColor: '#2E7D32',
    padding: 16,
    paddingBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileStatus: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
});

export default HomeScreen;

