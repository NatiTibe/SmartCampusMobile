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
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Phase 1: Request the 6-digit code
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'A 6-digit verification code has been sent to your email.');
      setIsCodeSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Phase 2: Submit code along with the new password
  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert('Fields required', 'Please enter the 6-digit code and your new password.');
      return;
    }

    if (code.length !== 6) {
      Alert.alert('Invalid code', 'The verification code must be exactly 6 digits.');
      return;
    }

    setLoading(true);
    try {
      // Connecting later to your code verification backend endpoint:
      // await verifyAndResetPassword({ email, code, newPassword });
      
      Alert.alert('Success', 'Your password has been successfully updated.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      Alert.alert('Reset Failed', err.message || 'Failed to update password.');
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
            // Form State 1: Requesting the Code
            <View style={styles.innerForm}>
              <Text style={styles.subtitleText}>
                Enter your email to receive a 6-digit account verification code.
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
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

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
          ) : (
            // Form State 2: Code input and password modification fields
            <View style={styles.innerForm}>
              <Text style={styles.subtitleText}>
                Enter the 6-digit code sent to <Text style={styles.emailHighlight}>{email}</Text> and type your new password.
              </Text>

              <View style={styles.inputContainer}>
                <View style={styles.iconBox}>
                  <Text style={styles.icon}>🔢</Text>
                </View>
                <TextInput 
                  placeholder="6-Digit Code" 
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  style={styles.input}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
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
                  onChangeText={setNewPassword}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <TouchableOpacity style={styles.actionBtn} onPress={handleResetPassword} disabled={loading}>
                <LinearGradient 
                  colors={['#00d2ff', '#3a7bd5']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.btnGradient}
                >
                  <Text style={styles.actionBtnText}>{loading ? 'Updating...' : 'Reset Password'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
  card: {
    width: width * 0.9,
    backgroundColor: '#0c1a2b', 
    borderRadius: 45,
    paddingVertical: 40,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  glowTitle: { 
    color: '#fff', 
    fontSize: 26, 
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.5
  },
  innerForm: {
    width: '100%',
    alignItems: 'center'
  },
  subtitleText: { 
    color: 'rgba(255,255,255,0.6)', 
    fontSize: 14, 
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
    paddingHorizontal: 5
  },
  emailHighlight: {
    color: '#00d2ff',
    fontWeight: '600'
  },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#152639', 
    borderRadius: 20, 
    paddingHorizontal: 15,
    height: 60,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  iconBox: { width: 30, alignItems: 'center' },
  icon: { fontSize: 18 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingLeft: 10 },
  actionBtn: { width: '100%', height: 65, borderRadius: 25, overflow: 'hidden', marginTop: 10 },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelButton: { marginTop: 20, padding: 5 },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, textDecorationLine: 'underline' }
});

export default ForgotPasswordScreen;