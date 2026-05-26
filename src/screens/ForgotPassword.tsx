import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, Dimensions, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { forgotPassword, resetPassword } from '../services/authService';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'If the account exists, a reset token has been sent to your email.');
      setIsCodeSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to request reset token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);

    if (!token || !newPassword) {
      setError('Please enter the reset token and your new password.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      Alert.alert('Success', 'Your password has been successfully updated.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
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
          
          {!isCodeSent ? (
            <View style={styles.innerForm}>
              <Text style={styles.subtitleText}>
                Enter your email to receive a password reset token.
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

              <TouchableOpacity style={styles.actionBtn} onPress={handleSendCode} disabled={loading}>
                <LinearGradient 
                  colors={['#00d2ff', '#3a7bd5']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.btnGradient}
                >
                  <Text style={styles.actionBtnText}>{loading ? 'Sending...' : 'Send Reset Email'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.innerForm}>
              <Text style={styles.subtitleText}>
                Paste the 32-character token sent to <Text style={styles.emailHighlight}>{email}</Text> and type your new password.
              </Text>

              <View style={styles.inputContainer}>
                <View style={styles.iconBox}>
                  <Text style={styles.icon}>🔑</Text>
                </View>
                <TextInput 
                  placeholder="Paste Reset Token Here" 
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  style={styles.input}
                  value={token}
                  onChangeText={(text) => { setToken(text); setError(null); }}
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.iconBox}>
                  <Text style={styles.icon}>🔒</Text>
                </View>
                <TextInput 
                  placeholder="New Password" 
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  style={styles.input}
                  value={newPassword}
                  onChangeText={(text) => { setNewPassword(text); setError(null); }}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.actionBtn} onPress={handleResetPassword} disabled={loading}>
                <LinearGradient 
                  colors={['#00d2ff', '#3a7bd5']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.btnGradient}
                >
                  <Text style={styles.actionBtnText}>{loading ? 'Updating...' : 'Confirm Reset'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

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
  cancelButton: { marginTop: 20, padding: 5 },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, textDecorationLine: 'underline' },
  errorContainer: { width: '100%', backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 107, 107, 0.3)', marginBottom: 15 },
  errorText: { color: '#ff6b6b', fontSize: 14, textAlign: 'center', fontWeight: '500' }
});

export default ForgotPasswordScreen;