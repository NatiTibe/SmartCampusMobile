import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/apiService';

const OrganizerDashboard = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        try {
          // Pointing to the correct route in organizerRoutes.ts
          const response = await api.get('/organizer/events');
          setEvents(response.data.events || []);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };
      fetchEvents();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={styles.header}>My Events</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEvent')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  header: { color: '#fff', fontSize: 24, padding: 20 },
  card: { padding: 20, margin: 10, backgroundColor: '#0c1a2b', borderRadius: 10 },
  title: { color: '#fff', fontSize: 18 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#00d2ff', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabText: { fontSize: 30, color: '#fff' }
});

export default OrganizerDashboard;