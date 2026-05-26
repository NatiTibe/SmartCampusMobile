import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/apiService';

const OrganizerDashboard = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        try {
          // Endpoint: /api/organizer/events
          const response = await api.get('/organizer/events');
          setEvents(response.data.events || response.data || []);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
      fetchEvents();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{color: '#fff'}}>{item.title}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={styles.header}>My Events</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEvent')}>
        <Text style={{color: '#fff'}}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000b18' },
  header: { color: '#fff', fontSize: 24, padding: 20 },
  card: { padding: 20, backgroundColor: '#0c1a2b', margin: 10 },
  fab: { position: 'absolute', right: 20, bottom: 20, padding: 20, backgroundColor: '#00d2ff', borderRadius: 30 }
});

export default OrganizerDashboard;