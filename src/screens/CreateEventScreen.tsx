import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, ScrollView, Alert, Image, Platform 
} from 'react-native';
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

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setDescription(editingEvent.description || '');
      setLocation(editingEvent.location || '');
      setImage(editingEvent.image || null);
      if (editingEvent.date) {
        setDate(new Date(editingEvent.date));
      }
    }
  }, [editingEvent]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onDateTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(null);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!title || !description || !location) {
      Alert.alert('Missing Fields', 'Please fill out the title, location, and description.');
      return;
    }

    if (!image && !editingEvent) {
      Alert.alert('Image Required', 'Please upload an event cover image.');
      return;
    }

    try {
      // 1. Initialize FormData payload required by your backend Multer setup
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('date', date.toISOString()); 

      // 2. Format and append image conditionally for Web vs. Mobile environments
      if (image && !image.startsWith('http')) {
        if (Platform.OS === 'web') {
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append('image', blob, 'event-cover.jpg');
        } else {
          const filename = image.split('/').pop() || 'event-cover.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;
          formData.append('image', {
            uri: image,
            name: filename,
            type: type,
          } as any);
        }
      }

      // 3. Configure multipart/form-data header content type
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingEvent) {
        // Calls: PUT /organizer/update/:id
        await api.put(`/organizer/update/${editingEvent.id}`, formData, config); 
        Alert.alert('Success', 'Event updated successfully!');
      } else {
        // Calls: POST /organizer/create
        await api.post('/organizer/create', formData, config); 
        Alert.alert('Success', 'Event submitted for approval!');
      }

      navigation.goBack();
      
    } catch (error: any) {
      console.log('Failed to submit event:', error);
      const serverMessage = error.response?.data?.message || 'There was a problem submitting your event.';
      Alert.alert('Submission Failed', serverMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backArrow}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>{editingEvent ? 'Edit Event' : 'Create Event'}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.fullImg} />
            ) : (
              <Text style={styles.uploadText}>📷 Tap to Upload Event Cover</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <View style={styles.row}>
            <TouchableOpacity style={[styles.input, { flex: 1, marginRight: 10 }]} onPress={() => setShowPicker('date')}>
              <Text style={{color: '#fff'}}>{date.toDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.input, { flex: 1 }]} onPress={() => setShowPicker('time')}>
              <Text style={{color: '#fff'}}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode={showPicker}
              display="default"
              onChange={onDateTimeChange}
            />
          )}

          <Text style={styles.label}>Location</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} />

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, { height: 100 }]} multiline value={description} onChangeText={setDescription} />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>{editingEvent ? 'Save Changes' : 'Submit for Approval'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  backArrow: { color: '#00d2ff', fontSize: 32, fontWeight: 'bold', marginRight: 15 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  imageBox: { height: 180, backgroundColor: '#0c1a2b', borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#3a7bd5', justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  fullImg: { width: '100%', height: '100%' },
  uploadText: { color: '#3a7bd5', fontWeight: 'bold' },
  label: { color: '#00d2ff', fontSize: 11, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#0c1a2b', borderRadius: 12, padding: 15, color: '#fff', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  row: { flexDirection: 'row' },
  submitBtn: { backgroundColor: '#00d2ff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 40 },
  submitText: { color: '#000b18', fontWeight: 'bold' }
});

export default CreateEventScreen;