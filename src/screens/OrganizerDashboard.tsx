import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OrganizerDashboard = ({ navigation }: any) => {
  // Dummy data for events created by this organizer
  const myEvents = [
    { id: '1', title: 'AAU Tech Expo 2026', rsvps: 145, interest: 230, status: 'Active' },
    { id: '2', title: 'UI/UX Workshop', rsvps: 45, interest: 89, status: 'Draft' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#001529', '#052c52']} style={styles.background} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Organizer Panel</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Stats Overview */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>190</Text>
              <Text style={styles.statLabel}>Total RSVPs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>319</Text>
              <Text style={styles.statLabel}>Total Interest</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Your Published Events</Text>

          {myEvents.map((event) => (
            <View key={event.id} style={styles.eventManageCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.statusBadge, {backgroundColor: event.status === 'Active' ? '#32CD32' : '#FFD700'}]}>
                    <Text style={styles.statusText}>{event.status}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Text style={styles.metricNum}>{event.rsvps}</Text>
                  <Text style={styles.metricLabel}>RSVPs</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricNum}>{event.interest}</Text>
                  <Text style={styles.metricLabel}>Interested</Text>
                </View>
                <TouchableOpacity style={styles.editIconBtn}>
                  <Text>✏️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity 
            style={styles.createNewBtn}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Text style={styles.createNewText}>+ Create New Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  backIcon: { color: '#fff', fontSize: 20 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statValue: { color: '#00d2ff', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 5 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  eventManageCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  eventInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  badgeRow: { marginTop: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, alignSelf: 'flex-start' },
  statusText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  metricsRow: { flexDirection: 'row', marginTop: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 },
  metric: { marginRight: 30 },
  metricNum: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  metricLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10 },
  editIconBtn: { marginLeft: 'auto', width: 35, height: 35, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  createNewBtn: { marginTop: 20, height: 55, borderRadius: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#00d2ff', justifyContent: 'center', alignItems: 'center' },
  createNewText: { color: '#00d2ff', fontWeight: 'bold' }
});

export default OrganizerDashboard;