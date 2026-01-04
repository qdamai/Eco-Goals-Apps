import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email tidak valid')
    .required('Email wajib diisi'),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const handleResetPassword = (values) => {
    // Here you would typically make an API call to initiate the password reset process
    console.log('Reset password for:', values.email);
    // For now, we'll just show an alert
    alert(`Instruksi reset kata sandi telah dikirim ke ${values.email}`);
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Icon name="lock-open-outline" size={60} color="#2E7D32" />
          <Text style={styles.title}>Lupa Kata Sandi?</Text>
          <Text style={styles.subtitle}>
            Masukkan email Anda untuk menerima instruksi reset kata sandi
          </Text>
        </View>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Icon name="mail-outline" size={20} color="#424242" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </View>
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleSubmit}>
                <Text style={styles.resetButtonText}>Reset Kata Sandi</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ingat kata sandi Anda? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Masuk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000000',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  resetButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    color: '#424242',
    fontSize: 14,
  },
  loginLink: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;