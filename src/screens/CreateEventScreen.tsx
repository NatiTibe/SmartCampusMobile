import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CreateEventScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#001529', '#003366']} style={styles.background} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backIcon}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Event</Text>
            <View style={{ width: 24 }} /> {/* Spacer for centering */}
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* 1. Image Upload Placeholder */}
            <TouchableOpacity style={styles.imageUploadBox}>
               <Text style={styles.uploadIcon}>🖼️</Text>
               <Text style={styles.uploadText}>Upload Event Banner</Text>
            </TouchableOpacity>

            {/* 2. Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.label}>Event Title</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. Annual Hackathon" 
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={title}
                onChangeText={setTitle}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Date</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="DD/MM/YYYY" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Time</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="HH:MM AM/PM" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                  />
                </View>
              </View>

              <Text style={styles.label}>Location</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. 6-Kill Campus, Hall 4" 
                placeholderTextColor="rgba(255,255,255,0.3)"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Tell students what the event is about..." 
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                numberOfLines={4}
                value={desc}
                onChangeText={setDesc}
              />

              <TouchableOpacity style={styles.publishBtn} onPress={() => navigation.navigate('Home')}>
                <LinearGradient
                  colors={['#00d2ff', '#3a7bd5']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>Publish Event</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  backIcon: { fontSize: 22, color: '#fff' },
  scrollContent: { padding: 20 },
  imageUploadBox: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 210, 255, 0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  uploadIcon: { fontSize: 40, marginBottom: 10 },
  uploadText: { color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  label: { color: '#00d2ff', fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  row: { flexDirection: 'row' },
  textArea: { height: 100, textAlignVertical: 'top' },
  publishBtn: { height: 55, borderRadius: 15, overflow: 'hidden', marginTop: 30 },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CreateEventScreen;