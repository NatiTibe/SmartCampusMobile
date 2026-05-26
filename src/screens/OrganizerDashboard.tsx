import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  SafeAreaView, Image, ScrollView, useWindowDimensions, Modal 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/apiService';

const OrganizerDashboard = ({ route, navigation }: any) => {
  const { width } = useWindowDimensions();
  const statBoxBasis = width > 640 ? '48%' : '100%';
  const imageSize = width > 420 ? 70 : 60;
  
  // Real Organizer Dataset initialized empty (No demo events)
  const [events, setEvents] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const response = await api.get('/event/organizer-events');
        const backendEvents = response.data?.events || response.data || [];
        setEvents(backendEvents.map((ev: any) => ({
          id: ev._id || ev.id,
          title: ev.title || '',
          status: ev.status || 'Pending',
          registrations: ev.registrationCount || ev.registeredCount || 0,
          time: ev.startDate ? `${new Date(ev.startDate).toDateString()} ${ev.startTime || ''}` : ev.time || '',
          image: ev.imageUrl || ev.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
          description: ev.description || ''
        })));
      } catch (error) {
        console.log('Failed to fetch organizer events', error);
      }
    };
    fetchOrganizerEvents();
  }, []);

  // Compute metrics dynamically based on active state updates
  const totalReach = events.reduce((acc, ev) => acc + (ev.registrations || 0), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header with Profile Button (NO ID PASSED) */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Organizer Panel</Text>
            <Text style={styles.headerSub}>Manage your campus impact</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileCircle} 
            onPress={() => navigation.navigate('Profile')} // Cleared ID params
          >
            <Text style={{fontSize: 20}}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Summary */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { flexBasis: statBoxBasis }] }>
            <Text style={styles.statNum}>{totalReach}</Text>
            <Text style={styles.statLabel}>Total Reach</Text>
          </View>
          <View style={[styles.statBox, { flexBasis: statBoxBasis }] }>
            <Text style={styles.statNum}>{events.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.createBtn} 
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <LinearGradient colors={['#00d2ff', '#3a7bd5']} style={styles.btnGradient}>
            <Text style={styles.createBtnText}>+ Create New Event</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your Events</Text>

        {/* Dynamic Map loop resolves structural scrolling hang-ups */}
        {events.length > 0 ? (
          events.map((item) => (
            <View key={item.id} style={styles.eventCard}>
              <Image source={{ uri: item.image }} style={[styles.eventImg, { width: imageSize, height: imageSize }]} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventTime}>{item.time}</Text>
                
                {/* Registration Count */}
                <View style={styles.regBadge}>
                  <Text style={styles.regText}>👥 {item.registrations} Joined</Text>
                </View>

                {/* Status Indicator */}
                <View style={[styles.statusTag, { backgroundColor: item.status === 'Approved' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)' }]}>
                  <Text style={[styles.statusText, { color: item.status === 'Approved' ? '#28a745' : '#ffc107' }]}>
                    ● {item.status}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.reportBtn} 
                onPress={() => setSelectedReport(item)}
              >
                <Text style={styles.reportBtnText}>📊 Analytics</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.editBtn} 
                onPress={() => navigation.navigate('CreateEvent', { event: item })}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)' }}>No posted events found.</Text>
          </View>
        )}

      </ScrollView>

      <Modal visible={!!selectedReport} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedReport?.title} Analysis</Text>
            <View style={styles.statBoxModal}>
              <Text style={styles.statLabel}>Total Registrations</Text>
              <Text style={styles.statValue}>{selectedReport?.registrations}</Text>
            </View>

            <Text style={styles.subTitle}>Engagement Status</Text>
            <Text style={styles.descText}>
              {selectedReport?.registrations > 100
                ? 'High engagement: Your event is trending!'
                : 'Moderate engagement: Consider sharing the event link on social media to boost sign-ups.'}
            </Text>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedReport(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingVertical: 15, paddingBottom: 80, paddingHorizontal: '5%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 25 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  profileCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, flexWrap: 'wrap' },
  statBox: { flexBasis: '48%', backgroundColor: '#0c1a2b', padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 10 },
  statNum: { color: '#00d2ff', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },
  createBtn: { height: 55, borderRadius: 15, overflow: 'hidden', marginBottom: 30 },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  eventCard: { flexDirection: 'row', backgroundColor: '#0c1a2b', padding: 15, borderRadius: 20, marginBottom: 15, alignItems: 'center', width: '100%' },
  eventImg: { width: 70, height: 70, borderRadius: 12 },
  eventInfo: { flex: 1, marginLeft: 15 },
  eventTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  eventTime: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  regBadge: { marginTop: 8 },
  regText: { color: '#00d2ff', fontSize: 12, fontWeight: 'bold' },
  statusTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  reportBtn: { padding: 10, marginRight: 10, backgroundColor: '#14233d', borderRadius: 12, borderWidth: 1, borderColor: '#00d2ff' },
  reportBtnText: { color: '#00d2ff', fontWeight: 'bold', fontSize: 12 },
  editBtn: { padding: 10 },
  editText: { color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0c1a2b', width: '90%', alignSelf: 'center', padding: 20, borderRadius: 20, minHeight: 300 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  statBoxModal: { backgroundColor: '#081122', padding: 20, borderRadius: 18, marginBottom: 15 },
  statValue: { color: '#00d2ff', fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  subTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  descText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 20 },
  closeBtn: { backgroundColor: '#00d2ff', padding: 16, borderRadius: 15, alignItems: 'center' },
  closeBtnText: { color: '#000b18', fontWeight: 'bold' }
});

export default OrganizerDashboard;