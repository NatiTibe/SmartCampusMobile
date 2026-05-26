import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api, { saveAccessToken } from '../services/apiService';

const ProfileScreen = ({ route, navigation }: any) => {
  const role = String(route?.params?.userRole || 'Student');
  const isStudent = role.toLowerCase() === 'student';
  const isOrganizer = role.toLowerCase() === 'organizer';

  const [name, setName] = useState(route?.params?.name || '');
  const [studentId, setStudentId] = useState(route?.params?.studentId || '');
  const [email, setEmail] = useState(route?.params?.email || '');
  const [organizationName, setOrganizationName] = useState(route?.params?.organizationName || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setMessage('');

    if (name.trim().length < 2) {
      setMessage('Name must be at least 2 characters.');
      return;
    }
    if (!email.trim()) {
      setMessage('Email is required.');
      return;
    }
    if (isOrganizer && organizationName.trim().length < 2) {
      setMessage('Organization name must be at least 2 characters.');
      return;
    }

    const payload: any = {
      fullName: name.trim(),
      email: email.trim(),
    };

    if (isStudent && studentId.trim()) {
      payload.studentId = studentId.trim();
    }
    if (isOrganizer) {
      payload.organizationName = organizationName.trim();
    }

    setSaving(true);
    try {
      await api.patch('/user/profile', payload);
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Logout request failed', error);
    } finally {
      await saveAccessToken(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.photoContainer}>
            <View style={styles.avatarLarge}>
              <Text style={{ fontSize: 50 }}>👤</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />

            {isOrganizer && (
              <>
                <Text style={styles.label}>Organization Name</Text>
                <TextInput
                  style={styles.input}
                  value={organizationName}
                  onChangeText={setOrganizationName}
                  placeholder="Enter organization name"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </>
            )}

            {isStudent && (
              <>
                <Text style={styles.label}>Student ID Number</Text>
                <TextInput
                  style={styles.input}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Enter your student ID"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                />
              </>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />
          </View>

          {message ? <Text style={styles.messageText}>{message}</Text> : null}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#000b18" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  backButton: { marginRight: 15, padding: 5 },
  backArrow: { color: '#00d2ff', fontSize: 32, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  photoContainer: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarLarge: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00d2ff' },
  form: { marginBottom: 20 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#0c1a2b', borderRadius: 12, padding: 15, color: '#fff', fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  messageText: { color: '#ff6b6b', textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#00d2ff', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  saveBtnText: { color: '#000b18', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { backgroundColor: '#0c1a2b', padding: 18, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#ff6b6b' },
  logoutBtnText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 16 },
});

export default ProfileScreen;
