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

  // Pre-fill all fields from signup/login params
  const [name, setName] = useState(route?.params?.name || route?.params?.fullName || '');
  const [email, setEmail] = useState(route?.params?.email || '');
  const [password, setPassword] = useState(route?.params?.password || '••••••••');
  const [phone, setPhone] = useState(route?.params?.phone || route?.params?.phoneNumber || '');
  const [studentId, setStudentId] = useState(route?.params?.studentId || '');
  const [organizationName, setOrganizationName] = useState(route?.params?.organizationName || '');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Generate initials from name for the avatar circle
  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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

    if (isStudent) {
      if (studentId.trim()) payload.studentId = studentId.trim();
      if (phone.trim()) payload.phoneNumber = phone.trim();
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- BACK BUTTON --- */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* --- AVATAR + NAME + BADGES (always visible) --- */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name || 'Your Name'}</Text>
            <Text style={styles.profileEmail}>{email || 'your@email.com'}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{role.toUpperCase()}</Text>
              </View>
              <View style={[styles.badge, styles.verifiedBadge]}>
                <Text style={[styles.badgeText, styles.verifiedText]}>VERIFIED ACCOUNT</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ============================================================
            STUDENT ONLY: Account Details card matching the screenshot
        ============================================================ */}
        {isStudent && (
          <View style={styles.card}>
            {/* Card header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardIconCircle}>
                <Text style={styles.cardIcon}>👤</Text>
              </View>
              <Text style={styles.cardTitle}>Account Details</Text>
            </View>

            {/* Full Name */}
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#aaa"
            />

            {/* Email Address */}
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.fieldInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
            />

            {/* Password */}
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <TextInput
              style={styles.fieldInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder="Enter password"
              placeholderTextColor="#aaa"
            />

            {/* Phone Number */}
            <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
            <TextInput
              style={[styles.fieldInput, styles.fieldInputHalf]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#aaa"
            />

            {message ? <Text style={styles.messageText}>{message}</Text> : null}

            {/* Update Profile button */}
            <TouchableOpacity style={styles.updateBtn} onPress={handleSave} disabled={saving}>
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.updateBtnText}>Update Profile</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================
            ORGANIZER: keeps original fields
        ============================================================ */}
        {isOrganizer && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconCircle}>
                <Text style={styles.cardIcon}>🏢</Text>
              </View>
              <Text style={styles.cardTitle}>Account Details</Text>
            </View>

            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.fieldLabel}>ORGANIZATION NAME</Text>
            <TextInput
              style={styles.fieldInput}
              value={organizationName}
              onChangeText={setOrganizationName}
              placeholder="Enter organization name"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.fieldInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
            />

            {message ? <Text style={styles.messageText}>{message}</Text> : null}

            <TouchableOpacity style={styles.updateBtn} onPress={handleSave} disabled={saving}>
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.updateBtnText}>Update Profile</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* --- LOGOUT --- */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f2f4f7' },
  scrollContent: { paddingBottom: 60 },

  backButton: { marginTop: 20, marginLeft: 20, marginBottom: 10, padding: 5, alignSelf: 'flex-start' },
  backArrow: { fontSize: 28, fontWeight: 'bold', color: '#3a7bd5' },

  // --- Avatar + Name Header ---
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8714a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    // subtle shadow
    shadowColor: '#e8714a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInitials: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  profileEmail: { fontSize: 13, color: '#666', marginTop: 2, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  badge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#3a7bd5' },
  verifiedBadge: { backgroundColor: '#e6f9f0' },
  verifiedText: { color: '#27ae60' },

  // --- Account Details Card ---
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardIcon: { fontSize: 18 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },

  // --- Form Fields ---
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#aab',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 4,
  },
  fieldInput: {
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a2e',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  // Half-width style for phone (matches screenshot)
  fieldInputHalf: {
    width: '60%',
  },

  messageText: { color: '#e74c3c', textAlign: 'center', marginBottom: 12, fontWeight: 'bold' },

  // --- Update Profile Button ---
  updateBtn: {
    backgroundColor: '#3a7bd5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  updateBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // --- Logout Button ---
  logoutBtn: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  logoutBtnText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 16 },
});

export default ProfileScreen;