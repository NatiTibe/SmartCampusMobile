import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, Alert, Platform, SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/apiService';

const CreateEventScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    // 1. Validation
    if (!title || !description || !location || !image) {
      Alert.alert('Error', 'Please fill all fields and pick an image.');
      return;
    }

    // 2. Prepare Form Data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('date', new Date().toISOString()); 

    // Handle Image for Multer
    const filename = image.split('/').pop() || 'event.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('image', {
      uri: image,
      name: filename,
      type: type,
    } as any);

    try {
      // 3. Submit to Server
      await api.post('/organizer/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 4. Success Behavior
      Alert.alert(
        'Submitted', 
        'Your event has been submitted and is currently waiting for admin approval.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('OrganizerDashboard') 
          }
        ]
      );
    } catch (error: any) {
      // 5. Debugging the 400 Error
      const errorMessage = error.response?.data?.message || 'Failed to create event.';
      console.log('Backend Error Details:', error.response?.data);
      Alert.alert('Submission Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor="#555" />
        
        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholderTextColor="#555" />
        
        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholderTextColor="#555" />
        
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          <Text style={styles.uploadText}>{image ? 'Image Selected' : 'Tap to Upload Image'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit for Approval</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  container: { padding: 20 },
  input: { backgroundColor: '#0c1a2b', padding: 15, color: '#fff', borderRadius: 12, marginBottom: 20 },
  label: { color: '#00d2ff', marginBottom: 5 },
  imageBox: { height: 150, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderRadius: 12 },
  uploadText: { color: '#fff' },
  submitBtn: { backgroundColor: '#00d2ff', padding: 15, alignItems: 'center', borderRadius: 10 },
  submitText: { fontWeight: 'bold', color: '#000' }
});

export default CreateEventScreen;