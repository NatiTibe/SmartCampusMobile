import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Dimensions, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { forgotPassword } from '../services/authService';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 1. We create a state variable to hold the error message
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    // Clear any previous errors when the user tries again
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'A 6-digit verification code has been sent to your email.');
      // Handle your next steps here (like showing the code input fields)
    } catch (err: any) {
      // 2. We catch the error thrown by authService.js and put it in state!
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.darkBackground} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.glowTitle}>Reset Password</Text>
          
          <View style={styles.innerForm}>
            <Text style={styles.subtitleText}>
              Enter your email to receive a 6-digit verification code.
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>📧</Text>
              </View>
              <TextInput 
                placeholder="Enter your email" 
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
                value={email}
                // Clear the error as soon as the user starts typing again
                onChangeText={(text) => { setEmail(text); setError(null); }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* 3. THIS IS THE UI ERROR DISPLAY */}
            {/* If the 'error' state has text, it renders this red text box */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.actionBtn} onPress={handleSendCode} disabled={loading}>
              <LinearGradient 
                colors={['#00d2ff', '#3a7bd5']} 
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                style={styles.btnGradient}
              >
                <Text style={styles.actionBtnText}>{loading ? 'Sending...' : 'Send Code'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
            <Text style={styles.cancelText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000b18' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: width * 0.9, backgroundColor: '#0c1a2b', borderRadius: 45, paddingVertical: 40, paddingHorizontal: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  glowTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  innerForm: { width: '100%', alignItems: 'center' },
  subtitleText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#152639', borderRadius: 20, paddingHorizontal: 15, height: 60, width: '100%', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconBox: { width: 30, alignItems: 'center' },
  icon: { fontSize: 18 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingLeft: 10 },
  actionBtn: { width: '100%', height: 65, borderRadius: 25, overflow: 'hidden', marginTop: 10 },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelButton: { marginTop: 25, padding: 5 },
  cancelText: { color: '#00d2ff', fontSize: 15, textDecorationLine: 'underline' },
  
  // New styles for the error message
  errorContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 107, 107, 0.1)', // Light red background
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    marginBottom: 15,
  },
  errorText: { 
    color: '#ff6b6b', 
    fontSize: 14, 
    textAlign: 'center', 
    fontWeight: '500' 
  }
});

export default ForgotPasswordScreen;