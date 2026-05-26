import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  SafeAreaView, FlatList, ActivityIndicator, Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/apiService';
import { formatStatus } from '../services/eventDataService';

const OrganizerDashboard = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('Pending');

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
      setEvents((response.data.events || []).map((event: any) => ({
        ...event,
        status: formatStatus(event.status),
      })));
    } catch (error: any) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Could not load your events.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const status = event.status || 'Pending';
    return status.toLowerCase() === selectedStatus.toLowerCase();
  });

  const renderEventItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>{item.location}</Text>
        <Text style={styles.details}>Date: {new Date(item.startDate).toLocaleDateString()}</Text>
      </View>
      <View style={[styles.statusTag, { backgroundColor: item.status === 'Approved' ? '#00ff9d' : item.status === 'Rejected' ? '#ff6b6b' : '#ffcc00' }]}>
        <Text style={styles.statusText}>{item.status || 'Pending'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.profileCircle}
        onPress={() => navigation.navigate('Profile', { userRole: 'Organizer' })}
      >
        <View style={styles.profileHead} />
        <View style={styles.profileBody} />
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>My Events</Text>
          <Text style={styles.headerSub}>Organizer Dashboard</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {['Pending', 'Approved', 'Rejected'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              selectedStatus === status && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                selectedStatus === status && styles.activeFilterText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#00d2ff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item._id}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No {selectedStatus.toLowerCase()} events found.</Text>}
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingRight: 58 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 },
  profileCircle: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0c1a2b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 20,
    elevation: 6,
  },
  profileHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7c4dff',
    marginBottom: 2,
  },
  profileBody: {
    width: 22,
    height: 10,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    backgroundColor: '#7c4dff',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e3050',
    alignItems: 'center',
    backgroundColor: '#0c1a2b',
  },
  activeFilterButton: {
    backgroundColor: '#00d2ff',
    borderColor: '#00d2ff',
  },
  filterText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  activeFilterText: {
    color: '#000',
  },
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
