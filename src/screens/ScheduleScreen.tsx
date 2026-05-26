import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getStudentEvents } from '../services/eventDataService';

const ScheduleScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchSchedule = async () => {
        try {
          const data = await getStudentEvents();
          setEvents(data.registeredEvents);
        } catch (error) {
          console.log('Failed to fetch schedule', error);
        }
      };

      fetchSchedule();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My Schedule</Text>
            <Text style={styles.headerSub}>You have {events.length} events</Text>
          </View>
        </View>

        <FlatList
          data={events}
          ListEmptyComponent={<Text style={styles.emptyText}>No registered events yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.timelineRow}>
              <View style={styles.timeColumn}><Text style={styles.timeText}>{item.time}</Text></View>
              <TouchableOpacity
                style={styles.scheduleCard}
                onPress={() => navigation.navigate('EventDetails', { eventId: item.id, event: item })}
              >
                <Text style={styles.dateBadge}>{item.date}</Text>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.locationText}>{item.location}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  backButton: { marginRight: 15, padding: 5 },
  backArrow: { color: '#00d2ff', fontSize: 32, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  headerSub: { color: '#00d2ff', fontSize: 13 },
  timelineRow: { flexDirection: 'row', marginBottom: 10 },
  timeColumn: { width: 60 },
  timeText: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  scheduleCard: { flex: 1, backgroundColor: '#0c1a2b', borderRadius: 20, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#3a7bd5' },
  dateBadge: { color: '#00d2ff', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  eventTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  locationText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 50 },
});

export default ScheduleScreen;
