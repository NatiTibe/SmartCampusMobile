import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

const REGISTERED_EVENTS = [
  { id: '1', title: 'AAU Tech Expo', time: '10:00 AM', date: 'May 10', location: '6 Kilo Main Hall' },
];

const ScheduleScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- HEADER WITH BACK BUTTON --- */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My Schedule</Text>
            <Text style={styles.headerSub}>You have {REGISTERED_EVENTS.length} events</Text>
          </View>
        </View>

        <FlatList
          data={REGISTERED_EVENTS}
          renderItem={({ item }) => (
            <View style={styles.timelineRow}>
              <View style={styles.timeColumn}><Text style={styles.timeText}>{item.time}</Text></View>
              <TouchableOpacity style={styles.scheduleCard}>
                <Text style={styles.dateBadge}>{item.date}</Text>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.locationText}>📍 {item.location}</Text>
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
  locationText: { color: 'rgba(255,255,255,0.6)', fontSize: 13 }
});

export default ScheduleScreen;