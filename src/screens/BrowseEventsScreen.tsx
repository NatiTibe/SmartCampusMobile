import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TouchableOpacity, 
  Modal, SafeAreaView, ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const INITIAL_EVENTS = [
  { id: '1', title: 'AAU Tech Expo 2026', location: '6 Kilo - Main Hall', time: 'May 10, 10:00 AM', description: 'Showcase of innovation.', isRegistered: false },
  { id: '2', title: 'Entrepreneurship Seminar', location: 'Amist Kilo', time: 'May 12, 2:00 PM', description: 'Pitching and funding.', isRegistered: false },
];

const BrowseEventsScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = (id: string) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, isRegistered: !ev.isRegistered } : ev));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- HEADER WITH BACK BUTTON --- */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Active Events</Text>
        </View>
        
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <TouchableOpacity onPress={() => { setSelectedEvent(item); setModalVisible(true); }}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventMeta}>📍 {item.location}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRegister(item.id)} style={styles.regBtnWrapper}>
                <LinearGradient
                  colors={item.isRegistered ? ['#28a745', '#1e7e34'] : ['#00d2ff', '#3a7bd5']}
                  style={styles.regButton}
                >
                  <Text style={styles.regBtnText}>{item.isRegistered ? '✓ Registered' : 'Register'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  backButton: { marginRight: 15, padding: 5 },
  backArrow: { color: '#00d2ff', fontSize: 32, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  eventCard: { backgroundColor: '#0c1a2b', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  eventTitle: { color: '#00d2ff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  eventMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 15 },
  regBtnWrapper: { height: 45, borderRadius: 12, overflow: 'hidden' },
  regButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  regBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default BrowseEventsScreen;