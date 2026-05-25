import React, { useState, useMemo, useEffect } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TouchableOpacity, 
  Image, SafeAreaView, ScrollView, Modal, useWindowDimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/apiService';

const HomeScreen = ({ route, navigation }: any) => {
  const { setUserRole, userRole = 'Student' } = route.params || {};
  const nextRole = userRole === 'Student' ? 'Organizer' : userRole === 'Organizer' ? 'Admin' : 'Student';
  const nextRoute = userRole === 'Student' ? 'OrganizerDashboard' : userRole === 'Organizer' ? 'AdminDashboard' : 'Home';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/event/all-events');
        const backendEvents = response.data?.events || [];
        if (backendEvents.length > 0) {
          setEvents(backendEvents.map((ev: any) => ({
            id: ev._id || ev.id,
            title: ev.title || '',
            category: ev.category?.name || ev.category || 'General',
            location: ev.location || 'Campus',
            date: ev.startDate ? new Date(ev.startDate).toDateString() : ev.date || '',
            time: ev.startTime || ev.time || '',
            registrationCount: ev.registrationCount || ev.registeredCount || 0,
            isRegistered: false,
            image: ev.imageUrl || ev.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
            description: ev.description || '',
          })));
        }
      } catch (error) {
        console.log('Failed to load backend events', error);
      }
    };

    fetchEvents();
  }, []);

  // 1. App State: Categories the student follows
  const [userSubscriptions] = useState(['Tech', 'Social']); 

  // 2. Master Event Data
  const [events, setEvents] = useState([
    { 
      id: '1', title: 'AAU Tech Expo', category: 'Tech', location: '6 Kilo', 
      date: 'May 10', time: '10:00 AM', registrationCount: 450, isRegistered: false,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
      description: 'A showcase of student innovation in AI and Robotics. Join us for networking!'
    },
    { 
      id: '2', title: 'Film festival', category: 'Social', location: '6 Kilo campus', 
      date: 'May 6', time: '03:00 PM', registrationCount: 520, isRegistered: false,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',
      description: 'Experience local student films and documentaries in an outdoor setting.'
    },
    { 
      id: '3', title: 'Python Bootcamp', category: 'Tech', location: 'Digital Library', 
      date: 'May 12', time: '09:00 AM', registrationCount: 120, isRegistered: false,
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
      description: 'A beginner-friendly intensive coding session for Python enthusiasts.'
    }
  ]);

  // Modal State for Event Details
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // LOGIC: Toggle registration
  const handleRegister = (id: string) => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, isRegistered: !ev.isRegistered, registrationCount: ev.isRegistered ? ev.registrationCount - 1 : ev.registrationCount + 1 } : ev
    ));
  };

  // LOGIC: Filter for Subscribed Feed
  const subscribedFeedEvents = useMemo(() => 
    events.filter(event => userSubscriptions.includes(event.category)), 
  [events, userSubscriptions]);

  // LOGIC: Sort for Popular Section
  const popularEvents = useMemo(() => 
    [...events].sort((a, b) => b.registrationCount - a.registrationCount), 
  [events]);

  const { width: windowWidth } = useWindowDimensions();
  const miniCardWidth = Math.min(260, windowWidth * 0.72);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER WITH PROFILE BUTTON & ROLE SWITCH --- */}
<View style={styles.topHeader}>
  <View>
    <Text style={styles.welcomeText}>Hello, Student!</Text>
    <Text style={styles.subWelcome}>Welcome back to Smart Campus</Text>
  </View>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity 
      style={[styles.profileCircle, { marginRight: 10 }]} 
      onPress={() => navigation.navigate('Profile')}
    >
      <Text style={{fontSize: 20}}>👤</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.profileCircle, { backgroundColor: '#FF3B30' }]}
      onPress={() => {
        setUserRole?.(nextRole);
        navigation.navigate(nextRoute, { userRole: nextRole, setUserRole });
      }}
    >
      <Text style={{fontSize: 14, color: '#fff', fontWeight: 'bold' }}>{`Switch to ${nextRole}`}</Text>
    </TouchableOpacity>
  </View>
</View>
        {/* --- HERO SECTION --- */}
        <LinearGradient colors={['#3a7bd5', '#00d2ff']} style={styles.heroCard}>
          <Text style={styles.heroEmoji}>👋</Text>
          <Text style={styles.heroText}>
            You have {events.filter(e => e.isRegistered).length} events coming up. Your AI-powered feed found new events matching your interests.
          </Text>
          
          <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('BrowseEvents')}>
            <Text style={styles.heroBtnText}>Browse All Events</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.heroBtnSecondary} onPress={() => navigation.navigate('Schedule')}>
            <Text style={styles.heroBtnText}>View My Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aiBtn} onPress={() => navigation.navigate('AIPicks')}>
            <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.aiGradient}>
              <Text style={styles.heroBtnText}>🪄 Discover AI Picks</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* --- SUBSCRIBED FEED --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Subscribed Feed</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SubscribedEvents', { userSubscriptions })}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {subscribedFeedEvents.length > 0 ? (
          <FlatList
            horizontal
            data={subscribedFeedEvents}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.miniCard, { width: miniCardWidth }]} onPress={() => { setSelectedEvent(item); setModalVisible(true); }}>
                <Image source={{ uri: item.image }} style={styles.miniImage} />
                <View style={styles.miniBadge}><Text style={styles.miniBadgeText}>{item.category}</Text></View>
                <Text style={styles.miniTitle}>{item.title}</Text>
                <Text style={styles.miniMeta}>{item.date} • {item.location}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyText}>No specific matches found yet. Subscribe to your favorite categories!</Text>
          </View>
        )}

        {/* --- POPULAR SECTION --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Around Campus</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PopularExplore')}>
            <Text style={styles.viewAll}>Explore All</Text>
          </TouchableOpacity>
        </View>

        {popularEvents.map((item) => (
          <TouchableOpacity key={item.id} style={styles.popularCard} onPress={() => { setSelectedEvent(item); setModalVisible(true); }}>
            <Image source={{ uri: item.image }} style={styles.popularImage} />
            <View style={styles.popularInfo}>
              <Text style={styles.popularCategory}>{item.category}</Text>
              <Text style={styles.popularTitle}>{item.title}</Text>
              <Text style={styles.popularMeta}>🔥 {item.registrationCount} students joined</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{height: 40}} />
      </ScrollView>

      {/* --- EVENT DETAILS MODAL --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text style={styles.modalLabel}>ABOUT</Text>
            <Text style={styles.modalDesc}>{selectedEvent?.description}</Text>
            <Text style={styles.modalLabel}>WHERE & WHEN</Text>
            <Text style={styles.modalDesc}>{selectedEvent?.location} • {selectedEvent?.time}</Text>

            <TouchableOpacity style={styles.modalRegBtn} onPress={() => handleRegister(selectedEvent?.id)}>
              <LinearGradient 
                colors={events.find(e => e.id === selectedEvent?.id)?.isRegistered ? ['#28a745', '#1e7e34'] : ['#00d2ff', '#3a7bd5']} 
                style={styles.aiGradient}
              >
                <Text style={styles.modalRegText}>
                  {events.find(e => e.id === selectedEvent?.id)?.isRegistered ? '✓ Registered' : 'Register Now'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Go Back</Text>
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
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 },
  welcomeText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  subWelcome: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  profileCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center' },
  // Hero Styles
  heroCard: { margin: 20, borderRadius: 30, padding: 25 },
  heroEmoji: { fontSize: 30, marginBottom: 10 },
  heroText: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 20, lineHeight: 22 },
  heroBtn: { backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 10 },
  heroBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 10 },
  heroBtnText: { color: '#000b18', fontWeight: 'bold' },
  aiBtn: { borderRadius: 15, overflow: 'hidden' },
  aiGradient: { padding: 15, alignItems: 'center' },
  // Section Headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  viewAll: { color: '#00d2ff', fontWeight: 'bold' },
  // Subscribed Feed Styles
  miniCard: { width: 220, backgroundColor: '#0c1a2b', borderRadius: 20, padding: 12, marginRight: 15 },
  miniImage: { width: '100%', height: 110, borderRadius: 15, marginBottom: 10 },
  miniBadge: { backgroundColor: 'rgba(0,210,255,0.1)', alignSelf: 'flex-start', padding: 4, borderRadius: 6 },
  miniBadgeText: { color: '#00d2ff', fontSize: 10, fontWeight: 'bold' },
  miniTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 5 },
  miniMeta: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  emptyFeed: { padding: 40, alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  // Popular Styles
  popularCard: { flexDirection: 'row', backgroundColor: '#0c1a2b', marginHorizontal: 20, marginBottom: 15, borderRadius: 20, padding: 12, alignItems: 'center' },
  popularImage: { width: 80, height: 80, borderRadius: 15 },
  popularInfo: { marginLeft: 15, flex: 1 },
  popularCategory: { color: '#00d2ff', fontSize: 10, fontWeight: 'bold' },
  popularTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  popularMeta: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 5 },
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0c1a2b', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: '#00d2ff' },
  modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  modalLabel: { color: '#00d2ff', fontSize: 12, fontWeight: 'bold', marginTop: 15 },
  modalDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 15, marginTop: 5, lineHeight: 22 },
  modalRegBtn: { borderRadius: 15, overflow: 'hidden', marginTop: 30 },
  modalRegText: { color: '#fff', fontWeight: 'bold' },
  modalClose: { marginTop: 15, alignItems: 'center' },
  modalCloseText: { color: '#00d2ff', fontWeight: 'bold' }
});

export default HomeScreen;