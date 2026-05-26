import React, { useCallback, useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  TouchableOpacity, SafeAreaView, Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getStudentEvents } from '../services/eventDataService';

const PopularExploreScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchEvents = async () => {
        try {
          const data = await getStudentEvents();
          setEvents(data.popularEvents);
        } catch (error) {
          console.log('Failed to fetch popular events', error);
        }
      };

      fetchEvents();
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
            <Text style={styles.headerTitle}>Trending Now</Text>
            <Text style={styles.headerSub}>Most popular events this week</Text>
          </View>
        </View>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No popular events yet.</Text>}
          renderItem={({ item, index }) => (
            <View style={styles.trendingCard}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <Image source={{ uri: item.image }} style={styles.trendingImage} />
              <View style={styles.trendingInfo}>
                <Text style={styles.trendingTitle}>{item.title}</Text>
                <Text style={styles.trendingMeta}>{item.registrationCount} students joined</Text>
                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate('EventDetails', { eventId: item.id, event: item })}
                >
                  <Text style={styles.detailsBtnText}>View Details</Text>
                </TouchableOpacity>
              </View>
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
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  trendingCard: { backgroundColor: '#0c1a2b', borderRadius: 20, flexDirection: 'row', padding: 15, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  rankBadge: { width: 35, alignItems: 'center' },
  rankText: { color: '#00d2ff', fontWeight: 'bold', fontSize: 16 },
  trendingImage: { width: 80, height: 80, borderRadius: 12, marginHorizontal: 15 },
  trendingInfo: { flex: 1 },
  trendingTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  trendingMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },
  detailsBtn: { marginTop: 8 },
  detailsBtnText: { color: '#3a7bd5', fontWeight: 'bold', fontSize: 12 },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 50 },
});

export default PopularExploreScreen;
