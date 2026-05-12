import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AdminApprovalScreen = ({ navigation }: any) => {
  const [pendingEvents, setPendingEvents] = useState([
    { id: '1', title: 'AAU Tech Expo', organizer: 'IT Dept' },
    { id: '2', title: 'Inter-College Football', organizer: 'Sports Club' }
  ]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#001529', '#1a3a5a']} style={styles.background} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{color: '#fff'}}>⬅️</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Review Board</Text>
          {/* Button to see the Home Feed AS an Admin */}
          <TouchableOpacity onPress={() => navigation.navigate('Home', { userRole: 'Admin' })}>
            <Text style={{color: '#00d2ff', fontWeight: 'bold'}}>View Feed</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {pendingEvents.map(event => (
            <View key={event.id} style={styles.card}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardSub}>By: {event.organizer}</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.btn, {backgroundColor: '#ff4d4d'}]}><Text style={styles.btnText}>Reject</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, {backgroundColor: '#32CD32'}]}><Text style={styles.btnText}>Approve</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 15, padding: 20, marginBottom: 15 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardSub: { color: 'gray', marginTop: 5 },
  btnRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  btn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginLeft: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default AdminApprovalScreen;