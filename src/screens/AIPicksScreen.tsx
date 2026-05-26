import React, { useCallback, useState } from 'react';
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getAiRecommendations, registerForEvent, unregisterFromEvent } from '../services/eventDataService';

const AIPicksScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchRecommendations = async () => {
        try {
          setEvents(await getAiRecommendations());
        } catch (error) {
          console.log('Failed to fetch AI picks', error);
        }
      };

      fetchRecommendations();
    }, [])
  );

  const toggleRegister = async (event: any) => {
    try {
      if (event.isRegistered) {
        await unregisterFromEvent(event.id);
      } else {
        await registerForEvent(event.id);
      }

      setEvents(prev => prev.map(item => item.id === event.id ? { ...item, isRegistered: !item.isRegistered } : item));
    } catch (error) {
      console.log('Registration update failed', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>AI Picks</Text>
            <Text style={styles.headerSub}>Personalized for your profile</Text>
          </View>
        </View>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No recommendations yet.</Text>}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.aiCard}>
              <View style={styles.matchBadge}>
                <LinearGradient colors={['#8E2DE2', '#4A00E0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.matchGradient}>
                  <Text style={styles.matchText}>{item.match} Match</Text>
                </LinearGradient>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { eventId: item.id, event: item })}>
                <Text style={styles.eventTitle}>{item.title}</Text>
              </TouchableOpacity>

              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>AI INSIGHT:</Text>
                <Text style={styles.reasonText}>{item.reason}</Text>
              </View>

              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>{item.location}</Text>
                <Text style={styles.metaText}>{item.date} {item.time}</Text>
              </View>

              <TouchableOpacity style={styles.regBtn} onPress={() => toggleRegister(item)}>
                <LinearGradient
                  colors={item.isRegistered ? ['#28a745', '#1e7e34'] : ['#00d2ff', '#3a7bd5']}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>{item.isRegistered ? 'Joined' : 'Register Now'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
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
  headerSub: { color: '#8E2DE2', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
  aiCard: { backgroundColor: '#0c1a2b', borderRadius: 25, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(142, 45, 226, 0.3)' },
  matchBadge: { alignSelf: 'flex-start', borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  matchGradient: { paddingHorizontal: 10, paddingVertical: 4 },
  matchText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  eventTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  reasonBox: { backgroundColor: 'rgba(142, 45, 226, 0.1)', padding: 12, borderRadius: 12, marginBottom: 15, borderLeftWidth: 3, borderLeftColor: '#8E2DE2' },
  reasonLabel: { color: '#8E2DE2', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  reasonText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontStyle: 'italic' },
  metaInfo: { marginBottom: 20 },
  metaText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 },
  regBtn: { height: 50, borderRadius: 12, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 50 },
});

export default AIPicksScreen;
