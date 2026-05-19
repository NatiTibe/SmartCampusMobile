import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  Image, KeyboardAvoidingView, Platform, Dimensions, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api, { saveAccessToken } from '../services/apiService';

const { width } = Dimensions.get('window');

const LoginScreen = ({ route, navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserRole } = route.params || {};

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login required', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const user = response.data?.user;
      const accessToken = response.data?.accessToken;

      if (!user || !accessToken) {
        throw new Error('Unexpected server response.');
      }

      await saveAccessToken(accessToken);

      const role = user.role || (user.email?.toLowerCase().includes('admin') ? 'Admin' : user.email?.toLowerCase().includes('organizer') ? 'Organizer' : 'Student');
      setUserRole?.(role);
      const nextRoute = role === 'Admin' ? 'AdminDashboard' : role === 'Organizer' ? 'OrganizerDashboard' : 'Home';

      navigation.reset({
        index: 0,
        routes: [{ name: nextRoute, params: { userRole: role, setUserRole } }],
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
      Alert.alert('Login failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.darkBackground} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        {/* FIXED PATH: Going up two levels to reach assets */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../../assets/login-illustration.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* The Card Design from image_d924bf.png */}
        <View style={styles.card}>
          <View style={styles.headerArea}>
            <Text style={styles.glowText}>AAU</Text>
            <Text style={styles.titleText}>SMART CAMPUS</Text>
            <Text style={styles.subTitleText}>EVENT MANAGEMENT</Text>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>📧</Text>
              </View>
              <TextInput 
                placeholder="Email" 
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>🔒</Text>
              </View>
              <TextInput 
                placeholder="Password" 
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <LinearGradient 
              colors={['#00d2ff', '#3a7bd5']} 
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              style={styles.btnGradient}
            >
              <Text style={styles.loginBtnText}>Log in</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>Create one.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkBackground: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#000b18' 
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  illustrationContainer: {
    width: width,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -45, 
    zIndex: 10,
  },
  illustration: { width: '85%', height: '100%' },

  card: {
    width: width * 0.9,
    backgroundColor: '#0c1a2b', 
    borderRadius: 45,
    paddingTop: 65,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },

  headerArea: { alignItems: 'center', marginBottom: 30 },
  glowText: { 
    color: '#00d2ff', 
    fontSize: 60, 
    fontWeight: 'bold', 
    textShadowColor: '#00d2ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  titleText: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: -5,
    letterSpacing: 1
  },
  subTitleText: { 
    color: 'rgba(255,255,255,0.5)', 
    fontSize: 11, 
    fontWeight: '600',
    marginTop: 5,
    textTransform: 'uppercase'
  },

  inputWrapper: { width: '100%', marginBottom: 25 },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#152639', 
    borderRadius: 20, 
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  iconBox: { width: 30, alignItems: 'center' },
  icon: { fontSize: 18 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingLeft: 10 },

  loginBtn: { width: '100%', height: 65, borderRadius: 25, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginBtnText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  footer: { flexDirection: 'row', marginTop: 25 },
  footerText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  signupText: { color: '#00d2ff', fontWeight: 'bold', fontSize: 14 }
});

export default LoginScreen;