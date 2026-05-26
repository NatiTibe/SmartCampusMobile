import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, Alert, SafeAreaView, ActivityIndicator, Platform, Modal, useWindowDimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker'; 
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
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 430);
  const horizontalPadding = width < 360 ? 14 : 20;
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
  const [draftDate, setDraftDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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

  const openDatePicker = (pickerKey: 'start' | 'end', value: string) => {
    const selectedDate = parseDateInput(value) || new Date();
    setDraftDate(selectedDate);
    setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setActiveDatePicker(pickerKey);
  };

  const applyDatePicker = () => {
    const nextValue = toDateTimeLocalValue(draftDate);
    if (activeDatePicker === 'start') {
      setStartDate(nextValue);
    }
    if (activeDatePicker === 'end') {
      setEndDate(nextValue);
    }
    setActiveDatePicker(null);
  };

  const changeCalendarMonth = (amount: number) => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  const selectCalendarDay = (day: number) => {
    setDraftDate(prev => new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      day,
      prev.getHours(),
      prev.getMinutes(),
    ));
  };

  const adjustDraftTime = (field: 'hour' | 'minute', amount: number) => {
    setDraftDate(prev => {
      const next = new Date(prev);
      if (field === 'hour') {
        next.setHours(next.getHours() + amount);
      } else {
        next.setMinutes(next.getMinutes() + amount);
      }
      return next;
    });
  };

  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Array<number | null> = Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(day);
    }

    return days;
  };

  const renderDateField = (
    label: string,
    value: string,
    pickerKey: 'start' | 'end',
  ) => {
    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => openDatePicker(pickerKey, value)}>
          <Text style={[styles.dateButtonText, !value && styles.datePlaceholder]}>
            {formatDateForDisplay(value) || 'Select date and time'}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderCalendarModal = () => {
    const monthLabel = calendarMonth.toLocaleString([], { month: 'long', year: 'numeric' });
    const selectedDay = draftDate.getFullYear() === calendarMonth.getFullYear()
      && draftDate.getMonth() === calendarMonth.getMonth()
      ? draftDate.getDate()
      : null;

    return (
      <Modal visible={!!activeDatePicker} transparent animationType="fade" onRequestClose={() => setActiveDatePicker(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.monthButton} onPress={() => changeCalendarMonth(-1)}>
                <Text style={styles.monthButtonText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>{monthLabel}</Text>
              <TouchableOpacity style={styles.monthButton} onPress={() => changeCalendarMonth(1)}>
                <Text style={styles.monthButtonText}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {getCalendarDays().map((day, index) => (
                <TouchableOpacity
                  key={`${day || 'blank'}-${index}`}
                  style={[
                    styles.dayCell,
                    day === selectedDay && styles.dayCellSelected,
                    !day && styles.dayCellBlank,
                  ]}
                  disabled={!day}
                  onPress={() => day && selectCalendarDay(day)}
                >
                  <Text style={[styles.dayText, day === selectedDay && styles.dayTextSelected]}>
                    {day || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Time</Text>
              <View style={styles.timeControls}>
                <View style={styles.timeControl}>
                  <TouchableOpacity style={styles.timeStepButton} onPress={() => adjustDraftTime('hour', 1)}>
                    <Text style={styles.timeStepText}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>{String(draftDate.getHours()).padStart(2, '0')}</Text>
                  <TouchableOpacity style={styles.timeStepButton} onPress={() => adjustDraftTime('hour', -1)}>
                    <Text style={styles.timeStepText}>-</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeControl}>
                  <TouchableOpacity style={styles.timeStepButton} onPress={() => adjustDraftTime('minute', 15)}>
                    <Text style={styles.timeStepText}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>{String(draftDate.getMinutes()).padStart(2, '0')}</Text>
                  <TouchableOpacity style={styles.timeStepButton} onPress={() => adjustDraftTime('minute', -15)}>
                    <Text style={styles.timeStepText}>-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.calendarActions}>
              <TouchableOpacity style={styles.cancelDateButton} onPress={() => setActiveDatePicker(null)}>
                <Text style={styles.cancelDateText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyDateButton} onPress={applyDatePicker}>
                <Text style={styles.applyDateText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { width: contentWidth, paddingHorizontal: horizontalPadding }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        nestedScrollEnabled
      >
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

        {renderDateField('Start Date', startDate, 'start')}
        {renderDateField('End Date', endDate, 'end')}
        
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          <Text style={styles.uploadText}>{image ? 'Image Selected' : 'Tap to Upload Image'}</Text>
        </TouchableOpacity>

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>Submit for Approval</Text>}
        </TouchableOpacity>
      </ScrollView>
      {renderCalendarModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  scrollView: { flex: 1 },
  scrollContent: { alignSelf: 'center', paddingTop: 20, paddingBottom: 40 },
  input: { backgroundColor: '#0c1a2b', padding: 15, color: '#fff', borderRadius: 12, marginBottom: 15 },
  label: { color: '#00d2ff', marginBottom: 5 },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15 },
  dateButton: { backgroundColor: '#0c1a2b', padding: 15, borderRadius: 12, marginBottom: 15 },
  dateButtonText: { color: '#fff' },
  datePlaceholder: { color: '#555' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'center', padding: 20 },
  calendarCard: { backgroundColor: '#0c1a2b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e3050' },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  calendarTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  monthButton: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#071323', alignItems: 'center', justifyContent: 'center' },
  monthButtonText: { color: '#00d2ff', fontSize: 28, fontWeight: 'bold' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, color: '#00d2ff', textAlign: 'center', fontSize: 11, fontWeight: 'bold' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  dayCellBlank: { opacity: 0 },
  dayCellSelected: { backgroundColor: '#00d2ff' },
  dayText: { color: '#fff', fontWeight: '600' },
  dayTextSelected: { color: '#000b18' },
  timeSection: { marginTop: 18, alignItems: 'center' },
  timeLabel: { color: '#00d2ff', fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
  timeControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  timeControl: { alignItems: 'center' },
  timeStepButton: { width: 42, height: 34, borderRadius: 8, backgroundColor: '#071323', alignItems: 'center', justifyContent: 'center' },
  timeStepText: { color: '#00d2ff', fontSize: 20, fontWeight: 'bold' },
  timeValue: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginVertical: 8, minWidth: 42, textAlign: 'center' },
  timeSeparator: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginHorizontal: 10 },
  calendarActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelDateButton: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#071323', alignItems: 'center' },
  cancelDateText: { color: '#fff', fontWeight: 'bold' },
  applyDateButton: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#00d2ff', alignItems: 'center' },
  applyDateText: { color: '#000b18', fontWeight: 'bold' },
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
