import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getApprovedEvents, registerForEvent, unregisterFromEvent } from '../services/eventDataService';

const BrowseEventsScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        try {
          setEvents(await getApprovedEvents());
        } catch (error) {
          console.log('Failed to fetch events', error);
        }
      };
      fetchEvents();
    }, [])
  );

  const handleRegister = async (event: any) => {
    try {
      if (event.isRegistered) {
        await unregisterFromEvent(event.id);
      } else {
        await registerForEvent(event.id);
      }
      setEvents(prev => prev.map(ev =>
        ev.id === event.id ? { ...ev, isRegistered: !ev.isRegistered } : ev
      ));
    } catch (error) {
      console.log('Registration update failed', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* FIX: header outside FlatList as a sibling */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Events</Text>
      </View>

      {/* FIX: FlatList gets flex:1 so it fills remaining space and scrolls */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No active events found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id, event: item })}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventMeta}>{item.date} • {item.location}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRegister(item)} style={styles.regBtnWrapper}>
              <LinearGradient
                colors={item.isRegistered ? ['#28a745', '#1e7e34'] : ['#00d2ff', '#3a7bd5']}
                style={styles.regButton}
              >
                <Text style={styles.regBtnText}>{item.isRegistered ? 'Registered' : 'Register'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  // FIX: header is now standalone outside FlatList
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20, paddingHorizontal: 20 },
  backButton: { marginRight: 15, padding: 5 },
  backArrow: { color: '#00d2ff', fontSize: 32, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  // FIX: list fills remaining space
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  eventCard: { backgroundColor: '#0c1a2b', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  eventTitle: { color: '#00d2ff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  eventMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 15 },
  regBtnWrapper: { height: 45, borderRadius: 12, overflow: 'hidden' },
  regButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  regBtnText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 50 },
});

export default BrowseEventsScreen;