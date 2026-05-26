import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getEventDetails, registerForEvent, unregisterFromEvent } from '../services/eventDataService';

const { width, height } = Dimensions.get('window');

const EventDetailsScreen = ({ route, navigation }: any) => {
  const { eventId, event: initialEvent } = route.params || {};
  const [event, setEvent] = useState<any>(initialEvent || null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const data = await getEventDetails(eventId);
        setEvent(data.event);
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Could not load event details.');
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    if (!event?.id) return;

    try {
      if (event.isRegistered) {
        await unregisterFromEvent(event.id);
      } else {
        await registerForEvent(event.id);
      }

      setEvent((prev: any) => ({
        ...prev,
        isRegistered: !prev.isRegistered,
        registrationCount: prev.isRegistered ? prev.registrationCount - 1 : prev.registrationCount + 1,
      }));
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#001529', '#003366']} style={styles.background} />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: event?.image }} style={styles.eventImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.badgeText}>{event?.category || 'General'}</Text>
          </View>

          <Text style={styles.titleText}>{event?.title || 'Event Details'}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.iconText}>Date</Text>
              <View>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{event?.date || 'TBD'}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.iconText}>Time</Text>
              <View>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{event?.time || 'TBD'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.locationBox}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{event?.location || 'Campus'}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.descriptionText}>{event?.description || 'No description available.'}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.rsvpBtn} onPress={handleRegister}>
          <LinearGradient
            colors={event?.isRegistered ? ['#28a745', '#1e7e34'] : ['#00d2ff', '#3a7bd5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>{event?.isRegistered ? 'Registered' : 'Register Now'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  imageContainer: { height: height * 0.35, width },
  eventImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 24, color: '#fff' },
  detailsCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginTop: -40, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', minHeight: height * 0.7 },
  categoryBadge: { backgroundColor: '#00d2ff', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 15 },
  badgeText: { color: '#001529', fontWeight: 'bold', fontSize: 12 },
  titleText: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 25 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoItem: { width: '48%' },
  locationBox: { marginBottom: 25 },
  iconText: { color: '#00d2ff', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  infoLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  infoValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  descriptionText: { color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 24, marginBottom: 100 },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'rgba(0,21,41,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  rsvpBtn: { height: 55, borderRadius: 18, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default EventDetailsScreen;
