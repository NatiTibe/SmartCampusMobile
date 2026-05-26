import React, { useCallback, useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  TouchableOpacity, SafeAreaView, Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getApprovedEvents } from '../services/eventDataService';

const SubscribedEventsScreen = ({ route, navigation }: any) => {
  const { userSubscriptions } = route.params || { userSubscriptions: [] };
  const [events, setEvents] = useState<any[]>(route.params?.events || []);

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        try {
          setEvents(await getApprovedEvents());
        } catch (error) {
          console.log('Failed to fetch subscribed events', error);
        }
      };

      fetchEvents();
    }, [])
  );

  const filteredEvents = events.filter(event => userSubscriptions.includes(event.category));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My Subscriptions</Text>
            <Text style={styles.headerSub}>Showing events for: {userSubscriptions.join(', ') || 'None'}</Text>
          </View>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No subscribed events found.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={() => navigation.navigate('EventDetails', { eventId: item.id, event: item })}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventMeta}>{item.date} • {item.location}</Text>
              </View>
            </TouchableOpacity>
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
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  eventCard: { backgroundColor: '#0c1a2b', borderRadius: 20, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardImage: { width: '100%', height: 150 },
  cardContent: { padding: 15 },
  categoryBadge: { backgroundColor: 'rgba(0, 210, 255, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 10 },
  categoryText: { color: '#00d2ff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  eventTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  eventMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 50 },
});

export default SubscribedEventsScreen;
