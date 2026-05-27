import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity,
  Image, SafeAreaView, ScrollView, Modal, useWindowDimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getApprovedEvents, getStudentEvents, registerForEvent, unregisterFromEvent } from '../services/eventDataService';

const HomeScreen = ({ route, navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);
  const [popularEvents, setPopularEvents] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchEvents = async () => {
        try {
          const [approved, studentData] = await Promise.all([
            getApprovedEvents(),
            getStudentEvents(),
          ]);
          if (isActive) {
            const registeredIds = new Set(studentData.registeredEvents.map((event: any) => event.id));
            setEvents(approved.map((event: any) => ({ ...event, isRegistered: registeredIds.has(event.id) })));
            setPopularEvents(studentData.popularEvents.length ? studentData.popularEvents : approved);
            setRegisteredEvents(studentData.registeredEvents);
          }
        } catch (error) {
          console.log('Failed to load backend events', error);
        }
      };
      fetchEvents();
      return () => { isActive = false; };
    }, [])
  );

  const [userSubscriptions] = useState(['Tech', 'Social']);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = async (id: string) => {
    const currentEvent = events.find(ev => ev.id === id) || selectedEvent;
    if (!currentEvent) return;
    try {
      if (currentEvent.isRegistered) {
        await unregisterFromEvent(id);
      } else {
        await registerForEvent(id);
      }
      setEvents(prev => prev.map(ev =>
        ev.id === id ? { ...ev, isRegistered: !ev.isRegistered, registrationCount: ev.isRegistered ? ev.registrationCount - 1 : ev.registrationCount + 1 } : ev
      ));
      setSelectedEvent((prev: any) => prev?.id === id ? { ...prev, isRegistered: !prev.isRegistered } : prev);
    } catch (error) {
      console.log('Registration update failed', error);
    }
  };

  const subscribedFeedEvents = useMemo(() =>
    events.filter(event => userSubscriptions.includes(event.category)),
    [events, userSubscriptions]);

  const sortedPopularEvents = useMemo(() =>
    [...popularEvents].sort((a, b) => b.registrationCount - a.registrationCount),
    [popularEvents]);

  const { width: windowWidth } = useWindowDimensions();
  const miniCardWidth = Math.min(260, windowWidth * 0.72);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* FIX 1: contentContainerStyle added with paddingBottom so last card
          isn't hidden behind the bottom tab bar */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeText}>Hello, Student!</Text>
            <Text style={styles.subWelcome}>Welcome back to Smart Campus</Text>
          </View>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => navigation.navigate('Profile', { userRole: 'Student' })}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </TouchableOpacity>
        </View>

        <LinearGradient colors={['#3a7bd5', '#00d2ff']} style={styles.heroCard}>
          <Text style={styles.heroEmoji}>👋</Text>
          <Text style={styles.heroText}>
            You have {registeredEvents.length} events coming up. Your AI-powered feed found new events matching your interests.
          </Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('BrowseEvents')}>
            <Text style={styles.heroBtnTextDark}>Browse All Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroBtnSecondary} onPress={() => navigation.navigate('Schedule')}>
            {/* FIX 3: secondary button on blue gradient — dark text is correct here */}
            <Text style={styles.heroBtnTextDark}>View My Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aiBtn} onPress={() => navigation.navigate('AIPicks')}>
            <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.aiGradient}>
              {/* FIX 3: AI button has dark purple gradient — text must be white */}
              <Text style={styles.heroBtnTextLight}>🪄 Discover AI Picks</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Subscribed Feed</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SubscribedEvents', { userSubscriptions, events })}>
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
              <TouchableOpacity
                style={[styles.miniCard, { width: miniCardWidth }]}
                onPress={() => { setSelectedEvent(item); setModalVisible(true); }}
              >
                <Image source={{ uri: item.image }} style={styles.miniImage} />
                <View style={styles.miniBadge}>
                  <Text style={styles.miniBadgeText}>{item.category}</Text>
                </View>
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Around Campus</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PopularExplore')}>
            <Text style={styles.viewAll}>Explore All</Text>
          </TouchableOpacity>
        </View>

        {sortedPopularEvents.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.popularCard}
            onPress={() => { setSelectedEvent(item); setModalVisible(true); }}
          >
            <Image source={{ uri: item.image }} style={styles.popularImage} />
            <View style={styles.popularInfo}>
              <Text style={styles.popularCategory}>{item.category}</Text>
              <Text style={styles.popularTitle}>{item.title}</Text>
              <Text style={styles.popularMeta}>🔥 {item.registrationCount} students joined</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FIX 2: Modal content now has its own ScrollView so long descriptions
          don't push the Register button off screen */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  container: { flex: 1 },
  // FIX 1: paddingBottom prevents last card being hidden behind tab bar
  scrollContent: { paddingBottom: 100 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 },
  welcomeText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  subWelcome: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  profileCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center' },
  heroCard: { margin: 20, borderRadius: 30, padding: 25 },
  heroEmoji: { fontSize: 30, marginBottom: 10 },
  heroText: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 20, lineHeight: 22 },
  heroBtn: { backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 10 },
  heroBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 10 },
  // FIX 3: split into two text styles — dark for light backgrounds, light for dark backgrounds
  heroBtnTextDark: { color: '#000b18', fontWeight: 'bold' },
  heroBtnTextLight: { color: '#fff', fontWeight: 'bold' },
  aiBtn: { borderRadius: 15, overflow: 'hidden' },
  aiGradient: { padding: 15, alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  viewAll: { color: '#00d2ff', fontWeight: 'bold' },
  miniCard: { width: 220, backgroundColor: '#0c1a2b', borderRadius: 20, padding: 12, marginRight: 15 },
  miniImage: { width: '100%', height: 110, borderRadius: 15, marginBottom: 10 },
  miniBadge: { backgroundColor: 'rgba(0,210,255,0.1)', alignSelf: 'flex-start', padding: 4, borderRadius: 6 },
  miniBadgeText: { color: '#00d2ff', fontSize: 10, fontWeight: 'bold' },
  miniTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 5 },
  miniMeta: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  emptyFeed: { padding: 40, alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  popularCard: { flexDirection: 'row', backgroundColor: '#0c1a2b', marginHorizontal: 20, marginBottom: 15, borderRadius: 20, padding: 12, alignItems: 'center' },
  popularImage: { width: 80, height: 80, borderRadius: 15 },
  popularInfo: { marginLeft: 15, flex: 1 },
  popularCategory: { color: '#00d2ff', fontSize: 10, fontWeight: 'bold' },
  popularTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  popularMeta: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 5 },
  // FIX 2: modalContent has maxHeight so it doesn't overflow; ScrollView inside handles the rest
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0c1a2b', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: '#00d2ff', maxHeight: '80%' },
  modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  modalLabel: { color: '#00d2ff', fontSize: 12, fontWeight: 'bold', marginTop: 15 },
  modalDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 15, marginTop: 5, lineHeight: 22 },
  modalRegBtn: { borderRadius: 15, overflow: 'hidden', marginTop: 30 },
  modalRegText: { color: '#fff', fontWeight: 'bold' },
  modalClose: { marginTop: 15, alignItems: 'center', paddingBottom: 5 },
  modalCloseText: { color: '#00d2ff', fontWeight: 'bold' },
});

export default HomeScreen;