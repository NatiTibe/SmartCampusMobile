import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  Image, KeyboardAvoidingView, Platform, useWindowDimensions,
  ScrollView, SafeAreaView, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api, { saveAccessToken, getErrorMessage } from '../services/apiService';

const SignupScreen = ({ route, navigation }: any) => {
  const { setUserRole } = route.params || {};
  const { width } = useWindowDimensions();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    setErrorMessage('');
    if (!name || !email || !studentId || !password) {
      Alert.alert('Sign up required', 'Please fill in all fields.');
      return;
    }
    try {
      const response = await api.post('/auth/signin', {
        fullName: name, studentId, email, password,
      });
      const user = response.data?.user;
      const accessToken = response.data?.accessToken;
      if (!user || !accessToken) throw new Error('Unexpected server response.');
      await saveAccessToken(accessToken);
      const role = user.role || 'Student';
      setUserRole?.(role);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { userRole: role, setUserRole } }],
      });
    } catch (error: any) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      Alert.alert('Sign up failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#001529', '#003366', '#0074D9']} style={styles.background} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kav}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.illustrationWrapper, { width: width * 0.92 }]}>
              <Image
                source={require('../../assets/login-illustration.png')}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.glassCard, { width: width * 0.92 }]}>
              <View style={styles.headerSection}>
                <Text style={styles.brandTitle}>Join AAU</Text>
                <Text style={styles.subTitle}>SMART CAMPUS{'\n'}EVENT MANAGEMENT</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputBox}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput style={styles.textField} placeholder="Full Name" placeholderTextColor="rgba(255,255,255,0.4)" value={name} onChangeText={setName} />
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput style={styles.textField} placeholder="University Email" placeholderTextColor="rgba(255,255,255,0.4)" value={email} onChangeText={setEmail} autoCapitalize="none" />
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.inputIcon}>🆔</Text>
                  <TextInput style={styles.textField} placeholder="Student ID" placeholderTextColor="rgba(255,255,255,0.4)" value={studentId} onChangeText={setStudentId} autoCapitalize="characters" />
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput style={styles.textField} placeholder="Password" placeholderTextColor="rgba(255,255,255,0.4)" secureTextEntry value={password} onChangeText={setPassword} />
                </View>

                <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
                  <LinearGradient colors={['#00d2ff', '#3a7bd5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                    <Text style={styles.btnText}>Create Account</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.footerText}>
                    Already have an account? <Text style={styles.boldText}>Log In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  kav: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: '5%', paddingVertical: 30 },
  illustrationWrapper: { justifyContent: 'center', alignItems: 'center', marginBottom: 10, height: 160 },
  illustration: { width: '80%', height: '100%', aspectRatio: 1.6 },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.18, shadowRadius: 28, elevation: 12 },
  headerSection: { alignItems: 'center', marginBottom: 24 },
  brandTitle: { color: '#00d2ff', fontSize: 36, fontWeight: '900', letterSpacing: 0.6, textAlign: 'center' },
  subTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 22, marginTop: 8, textAlign: 'center' },
  form: { width: '100%' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, height: 56, paddingHorizontal: 18, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  inputIcon: { fontSize: 17, marginRight: 12 },
  textField: { flex: 1, color: '#fff', fontSize: 15 },
  signupBtn: { height: 56, borderRadius: 18, overflow: 'hidden', marginTop: 18 },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  footerLink: { marginTop: 18, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  boldText: { fontWeight: '700', color: '#00d2ff' },
  errorText: { color: '#ff6b6b', marginTop: 10, textAlign: 'center' },
});

export default SignupScreen;