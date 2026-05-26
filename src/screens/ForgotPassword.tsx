import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { forgotPassword } from '../services/authService';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    try {
      // Calls the backend to generate and email a 6-digit verification code
      await forgotPassword(email);
      Alert.alert('Success', 'A 6-digit verification code has been sent to your email.');
      setIsCodeSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send verification code.');
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert('Error', 'Please fill in both the code and your new password.');
      return;
    }
    try {
      // Here you will link to your backend password update endpoint later
      // e.g., await verifyCodeAndResetPassword({ email, code, newPassword });
      Alert.alert('Success', 'Your password has been successfully reset.');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reset password.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        
        {!isCodeSent ? (
          <>
            <Text style={styles.subtitle}>Enter your email to receive a 6-digit verification code.</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.btn} onPress={handleSendCode}>
              <Text style={styles.btnText}>Send Code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to {email} and choose a new password.</Text>
            <TextInput
              placeholder="6-Digit Verification Code"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={code}
              onChangeText={setCode}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              secureTextEntry
            />
            <TouchableOpacity style={styles.btn} onPress={handleResetPassword}>
              <Text style={styles.btnText}>Reset Password</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000b18' },
  content: { flex: 1, padding: 25, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 25, textAlign: 'center', lineHeight: 20 },
  input: { backgroundColor: '#152639', padding: 15, borderRadius: 15, color: '#fff', marginBottom: 15, fontSize: 16 },
  btn: { backgroundColor: '#00d2ff', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#000b18', fontWeight: 'bold', fontSize: 16 },
  cancelText: { color: '#8fbfff', textAlign: 'center', marginTop: 25, fontSize: 14, textDecorationLine: 'underline' }
});

export default ForgotPasswordScreen;