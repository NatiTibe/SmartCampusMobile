import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { forgotPassword } from '../services/authService';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [resetEmail, setResetEmail] = useState('');

  const handleSendLink = async () => {
    if (!resetEmail) {
      Alert.alert('Email required', 'Please enter your email address.');
      return;
    }
    try {
      await forgotPassword(resetEmail);
      Alert.alert('Success', 'If an account exists, a reset link has been sent.');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send reset link.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={resetEmail}
          onChangeText={setResetEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.btn} onPress={handleSendLink}>
          <LinearGradient colors={['#00d2ff', '#3a7bd5']} style={styles.btnGradient}>
            <Text style={styles.btnText}>Send reset link</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000b18' },
  content: { flex: 1, padding: 25, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#152639', padding: 15, borderRadius: 15, color: '#fff', marginBottom: 20 },
  btn: { height: 50, borderRadius: 15, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  cancelText: { color: '#8fbfff', textAlign: 'center', marginTop: 20 }
});

export default ForgotPasswordScreen;