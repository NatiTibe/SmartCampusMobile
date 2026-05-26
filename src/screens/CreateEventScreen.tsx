import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, Alert, SafeAreaView, ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; 
import api from '../services/apiService';

const CreateEventScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/category/get');
        setCategories(response.data.categories || response.data || []);
      } catch (e) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const pickImage = async () => {
    // Request permission explicitly (recommended for iOS)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to your photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    // CRITICAL FIX: Check if canceled is false AND assets exist before reading
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title || !description || !location || !capacity || !category || !image) {
      Alert.alert('Error', 'Please fill all fields and pick an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('capacity', capacity); 
    formData.append('category', category);
    formData.append('startDate', new Date().toISOString()); 
    formData.append('endDate', new Date(Date.now() + 86400000).toISOString()); 

    // Handle Image
    const filename = image.split('/').pop() || 'event.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('image', {
      uri: image,
      name: filename,
      type: type,
    } as any);

    setLoading(true);
    try {
      // Axios automatically handles the headers for FormData
      await api.post('/organizer/create', formData);
      Alert.alert('Success', 'Event submitted for approval!');
      navigation.navigate('OrganizerDashboard');
    } catch (error: any) {
      console.log('Submission Error:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
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
        
        <Text style={styles.label}>Capacity</Text>
        <TextInput style={styles.input} value={capacity} onChangeText={setCapacity} keyboardType="numeric" placeholderTextColor="#555" />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={(item) => setCategory(item)}>
            <Picker.Item label="Select Category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
            ))}
          </Picker>
        </View>
        
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          <Text style={styles.uploadText}>{image ? 'Image Selected' : 'Tap to Upload Image'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Submit for Approval</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  container: { padding: 20 },
  input: { backgroundColor: '#0c1a2b', padding: 15, color: '#fff', borderRadius: 12, marginBottom: 15 },
  label: { color: '#00d2ff', marginBottom: 5 },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15 },
  imageBox: { height: 100, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderRadius: 12 },
  uploadText: { color: '#fff' },
  submitBtn: { backgroundColor: '#00d2ff', padding: 15, alignItems: 'center', borderRadius: 10 },
  submitText: { fontWeight: 'bold', color: '#000' }
});

export default CreateEventScreen;