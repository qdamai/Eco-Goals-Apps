import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';

const StepItem = ({ number, title, description, completed, onToggle, photoUri, onTakePhoto, onDeletePhoto }) => (
  <TouchableOpacity style={styles.stepItem} onPress={onToggle}>
    <View style={[styles.stepNumber, completed && styles.stepNumberCompleted]}>
      {completed ? (
        <Icon name="checkmark" size={16} color="#FFFFFF" />
      ) : (
        <Text style={styles.stepNumberText}>{number}</Text>
      )}
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
      
      <View style={styles.photoSection}>
        {photoUri ? (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <TouchableOpacity 
              style={styles.deletePhotoButton}
              onPress={onDeletePhoto}>
              <Icon name="close-circle" size={24} color="#FF5252" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.photoButton}
            onPress={onTakePhoto}>
            <Icon name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.photoButtonText}>Ambil Foto Dokumentasi</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const CompletionCertificate = ({ isVisible, onClose, challenge, completionDate }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.certificateContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}>
          <View style={styles.certificateHeader}>
            <Icon name="trophy" size={50} color="#FFD700" />
            <Text style={styles.certificateTitle}>Sertifikat Penyelesaian</Text>
          </View>
          
          <View style={styles.certificateContent}>
            <Text style={styles.certificateText}>
              Diberikan kepada
            </Text>
            <Text style={styles.certificateName}>
              Pengguna Eco Goals
            </Text>
            <Text style={styles.certificateText}>
              Atas keberhasilan menyelesaikan
            </Text>
            <Text style={styles.challengeTitle}>
              {challenge.title}
            </Text>
            <Text style={styles.certificateDate}>
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>

          <View style={styles.certificateFooter}>
            <TouchableOpacity 
              style={styles.certificateButton}
              onPress={() => {
                handleShare();
                onClose();
              }}>
              <Icon name="share-social" size={20} color="#FFFFFF" />
              <Text style={styles.certificateButtonText}>Bagikan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.certificateButton, styles.closeButton]}
              onPress={onClose}>
              <Text style={styles.certificateButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const ChallengeDetailScreen = ({ route, navigation }) => {
  console.log('ChallengeDetailScreen params:', route.params);
  const { challenge } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [photos, setPhotos] = useState({});
  const [steps, setSteps] = useState(challenge.steps || []);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved progress
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress when steps or photos change
  useEffect(() => {
    saveProgress();
  }, [steps, photos]);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(`challenge_${challenge.id}`);
      if (savedProgress) {
        const { savedSteps, savedPhotos, savedIsCompleted } = JSON.parse(savedProgress);
        setSteps(savedSteps);
        setPhotos(savedPhotos);
        setIsCompleted(savedIsCompleted);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      const progress = {
        savedSteps: steps,
        savedPhotos: photos,
        savedIsCompleted: isCompleted
      };
      await AsyncStorage.setItem(`challenge_${challenge.id}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    const allStepsCompleted = steps.every(step => step.completed);
    const allPhotosUploaded = steps.every(step => photos[step.id]);
    setCanComplete(allStepsCompleted && allPhotosUploaded && !isCompleted);
  }, [steps, photos, isCompleted]);

  useEffect(() => {
    const allStepsCompleted = steps.every(step => step.completed && photos[step.id]);
    if (allStepsCompleted && !isCompleted) {
      setIsCompleted(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowCertificate(true);
      }, 2000);
    }
  }, [steps, photos]);

  const handleTakePhoto = async (stepId) => {
    try {
      setIsLoading(true);
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
        const photoUri = result.assets[0].uri;
        setPhotos(prev => ({
          ...prev,
          [stepId]: photoUri
        }));
        
        // Simpan foto ke storage lokal
        try {
          await AsyncStorage.setItem(`photo_${challenge.id}_${stepId}`, photoUri);
        } catch (error) {
          console.error('Error saving photo:', error);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Gagal mengambil foto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = (stepId) => {
    setPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[stepId];
      return newPhotos;
    });
  };

  const toggleStep = (stepId) => {
    const newSteps = steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    setSteps(newSteps);

    const allCompleted = newSteps.every(step => step.completed && photos[step.id]);
    if (allCompleted && !isCompleted) {
      Alert.alert(
        'Selamat! 🎉',
        'Anda telah menyelesaikan semua langkah tantangan ini! Teruskan kebiasaan baik Anda untuk lingkungan yang lebih baik.',
        [
          {
            text: 'Lihat Sertifikat',
            onPress: () => setShowCertificate(true),
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    }
  };

  const handleShare = async () => {
    try {
      const message = isCompleted 
        ? `Saya telah menyelesaikan tantangan "${challenge.title}" di aplikasi Eco Goals! 🌱`
        : `Ayo ikuti tantangan "${challenge.title}" di aplikasi Eco Goals!`;
      
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Gagal membagikan tantangan');
    }
  };

  const handleStart = () => {
    Alert.alert(
      'Mulai Tantangan',
      'Apakah Anda siap untuk memulai tantangan ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Mulai',
          onPress: () => {
            Alert.alert('Sukses', 'Tantangan telah dimulai! Semangat!');
          },
        },
      ],
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Selesaikan Tantangan',
      'Apakah Anda yakin ingin menyelesaikan tantangan ini? Pastikan semua langkah dan dokumentasi telah lengkap.',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Selesaikan',
          onPress: () => {
            setIsCompleted(true);
            setShowConfetti(true);
            setTimeout(() => {
              Alert.alert(
                'Selamat! 🎉',
                'Anda telah berhasil menyelesaikan tantangan ini! Teruskan kebiasaan baik Anda untuk lingkungan yang lebih baik.',
                [
                  {
                    text: 'Lihat Sertifikat',
                    onPress: () => setShowCertificate(true)
                  },
                  {
                    text: 'OK',
                    style: 'default'
                  }
                ]
              );
            }, 2000);
          }
        }
      ]
    );
  };

  const benefits = [
    'Mengurangi konsumsi energi dan tagihan listrik',
    'Menurunkan emisi karbon dan dampak lingkungan',
    'Meningkatkan kesadaran akan penggunaan energi',
    'Mengembangkan kebiasaan hidup yang lebih berkelanjutan'
  ];

  const renderCompletionBadge = () => {
    if (isCompleted) {
      return (
        <View style={styles.completionBadge}>
          <Icon name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.completionText}>Tantangan Selesai!</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      )}
      
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
      
      <CompletionCertificate
        isVisible={showCertificate}
        onClose={() => setShowCertificate(false)}
        challenge={challenge}
        completionDate={new Date()}
      />

      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}>
            <Icon name="share-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon name={challenge.icon} size={32} color="#FFFFFF" />
            {isCompleted && (
              <View style={styles.completionIcon}>
                <Icon name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
            )}
          </View>
          <Text style={styles.title}>{challenge.title}</Text>
          {renderCompletionBadge()}
          
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{challenge.category}</Text>
            </View>
            <View style={[styles.tag, styles.difficultyTag]}>
              <Text style={styles.tagText}>{challenge.difficulty}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{challenge.duration}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <Progress.Circle
              progress={steps.filter(step => step.completed).length / steps.length}
              size={80}
              thickness={8}
              color={isCompleted ? "#4CAF50" : "#2E7D32"}
              unfilledColor="#E0E0E0"
              borderWidth={0}
              showsText
              formatText={() => `${Math.round((steps.filter(step => step.completed).length / steps.length) * 100)}%`}
            />
            <View style={styles.participantsInfo}>
              <Icon name="people-outline" size={24} color="#424242" />
              <Text style={styles.participantsText}>
                {challenge.participants} peserta
              </Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.description}>{challenge.description}</Text>
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Manfaat</Text>
            <View style={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Icon name="checkmark-circle" size={20} color="#2E7D32" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>Langkah-langkah</Text>
            {steps.map((step) => (
              <StepItem
                key={step.id}
                number={step.id}
                title={step.title}
                description={step.description}
                completed={step.completed}
                photoUri={photos[step.id]}
                onToggle={() => toggleStep(step.id)}
                onTakePhoto={() => handleTakePhoto(step.id)}
                onDeletePhoto={() => handleDeletePhoto(step.id)}
              />
            ))}
          </View>

          {canComplete && (
            <View style={styles.completeSection}>
              <Text style={styles.completeText}>
                Semua langkah dan dokumentasi telah lengkap! Anda dapat menyelesaikan tantangan ini.
              </Text>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}>
                <Icon name="checkmark-circle" size={24} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Selesaikan Tantangan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setIsSaved(!isSaved)}>
          <Icon
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#2E7D32"
          />
        </TouchableOpacity>
        {isCompleted ? (
          <View style={[styles.startButton, styles.completedButton]}>
            <Icon name="trophy" size={24} color="#FFFFFF" />
            <Text style={[styles.startButtonText, styles.completedButtonText]}>
              Tantangan Selesai
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}>
            <Text style={styles.startButtonText}>
              Mulai Tantangan
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#81C784',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  difficultyTag: {
    backgroundColor: '#FFEB3B',
  },
  tagText: {
    fontSize: 14,
    color: '#000000',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  participantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#424242',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
  stepsSection: {
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#81C784',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberCompleted: {
    backgroundColor: '#2E7D32',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#424242',
  },
  stepBenefits: {
    fontSize: 14,
    color: '#424242',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  startButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#2E7D32',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  benefitsSection: {
    marginVertical: 24,
  },
  benefitsList: {
    marginTop: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#424242',
    flex: 1,
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
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  completionText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  completionIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  stepProgressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
  },
  stepProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  certificateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    elevation: 5,
  },
  certificateHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 10,
    textAlign: 'center',
  },
  certificateContent: {
    alignItems: 'center',
    marginVertical: 20,
  },
  certificateText: {
    fontSize: 16,
    color: '#424242',
    marginVertical: 5,
    textAlign: 'center',
  },
  certificateName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 10,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginVertical: 10,
    textAlign: 'center',
  },
  certificateDate: {
    fontSize: 14,
    color: '#757575',
    marginTop: 10,
  },
  certificateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  certificateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: '#757575',
  },
  certificateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
  },
  completeSection: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  completeText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  completedButtonText: {
    marginLeft: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default ChallengeDetailScreen;

