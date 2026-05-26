import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/apiService'; // Ensure this points to your apiService

const CreateEventScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!title || !description || !image) {
      Alert.alert('Error', 'Please fill all fields and pick an image');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('date', new Date().toISOString()); // Simplified for testing

    // Correct handling for Multer
    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('image', {
      uri: image,
      name: filename,
      type: type,
    } as any);

    try {
      // Endpoint: /api/organizer/create
      await api.post('/organizer/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Event created!');
      navigation.goBack();
    } catch (error: any) {
      console.log(error.response?.data);
      Alert.alert('Error', 'Failed to create event. Check console.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput placeholder="Location" style={styles.input} value={location} onChangeText={setLocation} />
      <TouchableOpacity style={styles.btn} onPress={pickImage}>
        <Text>Pick Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={{color: '#fff'}}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000b18' },
  input: { backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 5 },
  btn: { padding: 15, backgroundColor: '#00d2ff', alignItems: 'center', marginVertical: 5 }
});

export default CreateEventScreen;