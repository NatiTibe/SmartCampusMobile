import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  SafeAreaView, FlatList, ActivityIndicator, Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/apiService';

const OrganizerDashboard = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect ensures the list refreshes every time the user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchOrganizerEvents();
    }, [])
  );

  const fetchOrganizerEvents = async () => {
    setLoading(true);
    try {
      // Calling the backend route defined in organizerRoutes.ts
      const response = await api.get('/organizer/events');
      setEvents(response.data.events || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Could not load your events.');
    } finally {
      setLoading(false);
    }
  };

  const renderEventItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>{item.location}</Text>
        <Text style={styles.details}>Date: {new Date(item.startDate).toLocaleDateString()}</Text>
      </View>
      <View style={[styles.statusTag, { backgroundColor: item.status === 'Approved' ? '#00ff9d' : '#ffcc00' }]}>
        <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Events</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#00d2ff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No events submitted yet.</Text>}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000b18', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  listContent: { paddingBottom: 100 },
  card: { 
    backgroundColor: '#0c1a2b', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1e3050'
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  details: { color: '#aaa', fontSize: 14 },
  statusTag: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 6, 
    marginTop: 10 
  },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#000' },
  emptyText: { color: '#555', textAlign: 'center', marginTop: 50 },
  fab: { 
    position: 'absolute', 
    right: 25, 
    bottom: 25, 
    width: 60, 
    height: 60, 
    backgroundColor: '#00d2ff', 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#00d2ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  fabText: { fontSize: 30, fontWeight: 'bold', color: '#000' }
});

export default OrganizerDashboard;