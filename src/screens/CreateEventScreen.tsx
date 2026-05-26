import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../services/apiService';

const CreateEventScreen = ({ navigation, route }: any) => {
  const editingEvent = route.params?.event;
  const [title, setTitle] = useState(editingEvent?.title || '');
  const [description, setDescription] = useState(editingEvent?.description || '');
  const [location, setLocation] = useState(editingEvent?.location || '');
  const [image, setImage] = useState<string | null>(editingEvent?.image || null);
  const [date, setDate] = useState(editingEvent?.date ? new Date(editingEvent.date) : new Date());
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('date', date.toISOString());

    if (image && !image.startsWith('http')) {
      if (Platform.OS === 'web') {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append('image', blob, 'event.jpg');
      } else {
        formData.append('image', { uri: image, name: 'event.jpg', type: 'image/jpeg' } as any);
      }
    }

    try {
      // Sending to /organizer/create as per organizerRoutes.ts
      await api.post('/organizer/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Event created successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Creation failed');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          <Text style={styles.uploadText}>{image ? 'Image Selected' : 'Tap to Upload Image'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Event</Text>
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
  imageBox: { height: 150, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  uploadText: { color: '#fff' },
  submitBtn: { backgroundColor: '#00d2ff', padding: 15, alignItems: 'center', borderRadius: 10 },
  submitText: { fontWeight: 'bold' }
});

export default CreateEventScreen;