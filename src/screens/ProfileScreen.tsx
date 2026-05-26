import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';

const ProfileScreen = ({ route, navigation }: any) => {
  // Check if an ID was passed in the navigation route (only students pass this)
  const isStudent = !!route?.params?.id;

  const [name, setName] = useState('Abebe Bikila');
  const [studentId, setStudentId] = useState('UGR/1234/15');
  const [email, setEmail] = useState('abebe.b@aau.edu.et');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- HEADER WITH CYAN BACK BUTTON --- */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            {/* Using the cyan arrow style from your Browse screen */}
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >

          {/* Profile Photo Section */}
          <View style={styles.photoContainer}>
            <View style={styles.avatarLarge}>
              <Text style={{ fontSize: 50 }}>👤</Text>
            </View>

            <TouchableOpacity style={styles.changePhotoBtn}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>

            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholder="Enter your full name"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />

            {/* CONDITIONALLY RENDER STUDENT ID FIELD */}
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

            <Text style={styles.label}>University Email</Text>
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />

          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveBtn} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => {
              console.log("User logged out");
              navigation.replace('Login');
            }}
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#000b18' 
  },

  container: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  
  // Header Style
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 20, 
    marginBottom: 20 
  },

  backButton: { 
    marginRight: 15, 
    padding: 5 
  },

  backArrow: { 
    color: '#00d2ff',
    fontSize: 32, 
    fontWeight: 'bold' 
  },

  headerTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },

  scrollContent: { 
    paddingBottom: 40 
  },

  photoContainer: { 
    alignItems: 'center', 
    marginBottom: 30, 
    marginTop: 10 
  },

  avatarLarge: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: '#0c1a2b', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#00d2ff' 
  },

  changePhotoBtn: { 
    marginTop: 15 
  },

  changePhotoText: { 
    color: '#00d2ff', 
    fontWeight: 'bold' 
  },

  form: { 
    marginBottom: 30 
  },

  label: { 
    color: 'rgba(255,255,255,0.5)', 
    fontSize: 12, 
    marginBottom: 8, 
    textTransform: 'uppercase' 
  },

  input: { 
    backgroundColor: '#0c1a2b', 
    borderRadius: 12, 
    padding: 15, 
    color: '#fff', 
    fontSize: 16, 
    marginBottom: 20,
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)'
  },

  saveBtn: { 
    backgroundColor: '#00d2ff', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center',
    marginBottom: 15
  },

  saveBtnText: { 
    color: '#000b18', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  // Logout Button Styles
  logoutBtn: { 
    backgroundColor: '#0c1a2b',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b'
  },

  logoutBtnText: { 
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ProfileScreen;