import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const EventDetailsScreen = ({ route, navigation }: any) => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Destructure params passed from HomeScreen
  const { eventTitle, eventLoc, eventTime, eventColor } = route.params || {
    eventTitle: 'Event Details',
    eventLoc: 'TBD',
    eventTime: 'TBD',
    eventColor: '#00d2ff'
  };

  const handleRegister = () => {
    setShowSuccess(true);
    
    // Smooth transition back home after showing success
    setTimeout(() => {
      setShowSuccess(false);
      navigation.navigate('Home');
    }, 2500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#001529', '#003366']} style={styles.background} />
      
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1540575861501-7ce0e220bad2?auto=format&fit=crop&w=800' }} 
            style={styles.eventImage}
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>⬅️</Text>
          </TouchableOpacity>
        </View>

        {/* Content Card */}
        <View style={styles.detailsCard}>
          <View style={[styles.categoryBadge, { backgroundColor: eventColor }]}>
            <Text style={styles.badgeText}>Academic</Text>
          </View>
          
          <Text style={styles.titleText}>{eventTitle}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.iconText}>📅</Text>
              <View>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>April 25, 2026</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.iconText}>🕒</Text>
              <View>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{eventTime}</Text>
              </View>
            </View>
          </View>

          <View style={styles.locationBox}>
            <Text style={styles.iconText}>📍</Text>
            <View>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{eventLoc}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.descriptionText}>
            This is a premier event hosted at Addis Ababa University. 
            Students will have the opportunity to network, learn, and engage 
            with experts in the field. Don't miss out!
          </Text>
        </View>
      </ScrollView>

      {/* THE ACTION BUTTON SECTION */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.rsvpBtn} onPress={handleRegister}>
          <LinearGradient
            colors={['#00d2ff', '#3a7bd5']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>Confirm RSVP</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* SUCCESS MODAL */}
      <Modal transparent={true} visible={showSuccess} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>✔️</Text>
            </View>
            <Text style={styles.successTitle}>Registration Successful!</Text>
            <Text style={styles.successSub}>You're all set for {eventTitle}.</Text>
            <Text style={styles.autoCloseText}>Returning to Home...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  imageContainer: { height: height * 0.35, width: width },
  eventImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 18, color: '#fff' },
  detailsCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginTop: -40, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', minHeight: height * 0.7 },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 15 },
  badgeText: { color: '#001529', fontWeight: 'bold', fontSize: 12 },
  titleText: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 25 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'center', width: '48%' },
  locationBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  iconText: { fontSize: 24, marginRight: 15 },
  infoLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  infoValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  descriptionText: { color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 24, marginBottom: 100 },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', padding: 25, backgroundColor: 'rgba(0,21,41,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  rsvpBtn: { height: 55, borderRadius: 18, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  successCard: { width: width * 0.8, backgroundColor: '#00264d', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0, 210, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#00d2ff' },
  checkIcon: { fontSize: 40 },
  successTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  successSub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', marginTop: 10 },
  autoCloseText: { color: '#00d2ff', fontSize: 12, marginTop: 25 }
});

export default EventDetailsScreen;