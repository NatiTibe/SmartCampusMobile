import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, Alert, SafeAreaView, ActivityIndicator, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../services/apiService';

type SelectedImage = {
  uri: string;
  name: string;
  type: string;
  file?: File;
};

const API_BASE_URL = 'https://smart-campus-event-management-and.onrender.com/api';

const postFormDataOnWeb = (path: string, formData: FormData) => {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open('POST', `${API_BASE_URL}${path}`);

    const token = localStorage.getItem('accessToken');
    if (token) {
      request.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }

      try {
        reject({ response: { data: JSON.parse(request.responseText) } });
      } catch {
        reject(new Error(request.responseText || 'Failed to create event.'));
      }
    };

    request.onerror = () => reject(new Error('Network error while creating event.'));
    request.send(formData);
  });
};

const CreateEventScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeDatePicker, setActiveDatePicker] = useState<'start' | 'end' | null>(null);

  const parseDateInput = (value: string) => {
    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const toDateTimeLocalValue = (date: Date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  };

  const formatDateForDisplay = (value: string) => {
    const date = parseDateInput(value);
    if (!date) return '';
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDateField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    pickerKey: 'start' | 'end',
  ) => {
    const selectedDate = parseDateInput(value) || new Date();

    return (
      <>
        <Text style={styles.label}>{label}</Text>
        {Platform.OS === 'web' ? (
          <View style={styles.webDateInputWrapper}>
            {React.createElement('input', {
              type: 'datetime-local',
              value,
              onChange: (event: any) => onChange(event.target.value),
              style: styles.webDateInput,
            })}
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.dateButton} onPress={() => setActiveDatePicker(pickerKey)}>
              <Text style={[styles.dateButtonText, !value && styles.datePlaceholder]}>
                {formatDateForDisplay(value) || 'Select date and time'}
              </Text>
            </TouchableOpacity>
            {activeDatePicker === pickerKey && (
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="default"
                onChange={(_, selected) => {
                  setActiveDatePicker(null);
                  if (selected) {
                    onChange(toDateTimeLocalValue(selected));
                  }
                }}
              />
            )}
          </>
        )}
      </>
    );
  };

  const validateEventForm = () => {
    const parsedStartDate = parseDateInput(startDate);
    const parsedEndDate = parseDateInput(endDate);

    if (title.trim().length < 3) return 'Title must be at least 3 characters';
    if (description.trim().length < 10) return 'Description must be at least 10 characters';
    if (location.trim().length < 3) return 'Location must be at least 3 characters';
    if (category.trim().length < 4) return 'Category is required';
    if (!capacity || Number(capacity) < 1) return 'Capacity must be at least 1';
    if (!parsedStartDate) return 'Start date is required. Use a valid date like 2026-05-26 14:00';
    if (!parsedEndDate) return 'End date is required. Use a valid date like 2026-05-26 16:00';
    if (parsedEndDate <= parsedStartDate) return 'End date must be after start date';
    if (!image) return 'Image is required';

    return '';
  };

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
      const asset = result.assets[0];
      const filename = asset.fileName || asset.uri.split('/').pop() || 'event.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = asset.mimeType || (match ? `image/${match[1]}` : 'image/jpeg');

      setImage({
        uri: asset.uri,
        name: filename,
        type,
        file: (asset as any).file,
      });
      setSubmitError('');
    }
  };

  const handleSubmit = async () => {
    setSubmitError('');

    const validationError = validateEventForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    const parsedStartDate = parseDateInput(startDate);
    const parsedEndDate = parseDateInput(endDate);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('location', location.trim());
    formData.append('capacity', capacity); 
    formData.append('category', category.trim());
    formData.append('startDate', parsedStartDate!.toISOString()); 
    formData.append('endDate', parsedEndDate!.toISOString()); 

    setLoading(true);
    try {
      // Expo web returns a browser URI/data URI, so convert it to a real Blob
      // before appending. Native uploads should keep the React Native file object.
      if (Platform.OS === 'web') {
        if (image.file) {
          formData.append('image', image.file);
        } else {
          const imageResponse = await fetch(image.uri);
          const imageBlob = await imageResponse.blob();
          const imageFile = new File([imageBlob], image.name, { type: image.type || imageBlob.type });
          formData.append('image', imageFile);
        }
      } else {
        formData.append('image', {
          uri: image.uri,
          name: image.name,
          type: image.type,
        } as any);
      }

      if (Platform.OS === 'web') {
        await postFormDataOnWeb('/organizer/create', formData);
      } else {
        // Axios automatically handles the headers for FormData on native.
        await api.post('/organizer/create', formData);
      }
      setSubmitted(true);
    } catch (error: any) {
      console.log('Submission Error:', error.response?.data);
      setSubmitError(error.response?.data?.message || error.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Successfully submitted</Text>
          <Text style={styles.successMessage}>Your event is waiting for admin approval.</Text>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => navigation.navigate('OrganizerDashboard')}
          >
            <Text style={styles.submitText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              <Picker.Item key={cat._id || cat.name} label={cat.name} value={cat.name} />
            ))}
          </Picker>
        </View>

        {renderDateField('Start Date', startDate, setStartDate, 'start')}
        {renderDateField('End Date', endDate, setEndDate, 'end')}
        
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          <Text style={styles.uploadText}>{image ? 'Image Selected' : 'Tap to Upload Image'}</Text>
        </TouchableOpacity>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

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
  dateButton: { backgroundColor: '#0c1a2b', padding: 15, borderRadius: 12, marginBottom: 15 },
  dateButtonText: { color: '#fff' },
  datePlaceholder: { color: '#555' },
  webDateInputWrapper: { backgroundColor: '#0c1a2b', borderRadius: 12, marginBottom: 15, overflow: 'hidden' },
  webDateInput: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#0c1a2b',
    color: '#fff',
    borderWidth: 0,
    borderStyle: 'solid',
    outlineStyle: 'none',
    padding: 15,
    fontSize: 14,
  } as any,
  imageBox: { height: 100, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderRadius: 12 },
  uploadText: { color: '#fff' },
  errorText: { color: '#ff6b6b', textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#00d2ff', padding: 15, alignItems: 'center', borderRadius: 10 },
  submitText: { fontWeight: 'bold', color: '#000' },
  successContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  successTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
  },
});

export default CreateEventScreen;
