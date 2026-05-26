import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { forgotPassword } from '../services/authService';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSendEmail = async () => {
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.');
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
          
          {!isSent ? (
            /* STEP 1: ENTER EMAIL FLOW */
            <View style={styles.innerForm}>
              <Text style={styles.glowTitle}>Reset Password</Text>
              
              <Text style={styles.subtitleText}>
                Enter your email to receive a password reset link.
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
                  onChangeText={(text) => { setEmail(text); setError(null); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.actionBtn} onPress={handleSendEmail} disabled={loading}>
                <LinearGradient 
                  colors={['#00d2ff', '#3a7bd5']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.btnGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.actionBtnText}>Send Reset Email</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
                <Text style={styles.cancelText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* STEP 2: CLEAN SUCCESS CONFIRMATION STATE */
            <View style={styles.innerForm}>
              <View style={styles.successIconBox}>
                <Text style={styles.successIcon}>🎉</Text>
              </View>
              
              <Text style={styles.glowTitle}>Successfully Sent!</Text>
              
              <Text style={styles.subtitleText}>
                A password reset link has been successfully sent to <Text style={styles.emailHighlight}>{email}</Text>. Please check your email inbox to safely complete your password modification on the web.
              </Text>

              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Login')}>
                <LinearGradient 
                  colors={['#00d2ff', '#3a7bd5']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.btnGradient}
                >
                  <Text style={styles.actionBtnText}>Back to Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000b18' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: width * 0.9, backgroundColor: '#0c1a2b', borderRadius: 45, paddingVertical: 45, paddingHorizontal: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  glowTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', letterSpacing: 0.5 },
  innerForm: { width: '100%', alignItems: 'center' },
  subtitleText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 25, paddingHorizontal: 5 },
  emailHighlight: { color: '#00d2ff', fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#152639', borderRadius: 20, paddingHorizontal: 15, height: 60, width: '100%', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconBox: { width: 30, alignItems: 'center' },
  icon: { fontSize: 18 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingLeft: 10 },
  actionBtn: { width: '100%', height: 65, borderRadius: 25, overflow: 'hidden', marginTop: 10 },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelButton: { marginTop: 25, padding: 5 },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, textDecorationLine: 'underline' },
  errorContainer: { width: '100%', backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 107, 107, 0.3)', marginBottom: 15 },
  errorText: { color: '#ff6b6b', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  successIconBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0, 210, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successIcon: { fontSize: 28 }
});

export default ForgotPasswordScreen;