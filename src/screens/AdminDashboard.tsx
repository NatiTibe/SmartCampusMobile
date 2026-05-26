import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  SafeAreaView, Image, Modal, ScrollView, Alert, useWindowDimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AdminDashboard = ({ route, navigation }: any) => {
  const { width } = useWindowDimensions();
  const eventImageSize = width > 420 ? 60 : 50;
  const reportMaxWidth = Math.min(width - 40, 620);

  const [events, setEvents] = useState([
    { 
      id: '101', title: 'AI Ethics & Future Talk', organizer: 'Computer Science Club',
      category: 'Tech', location: 'Main Auditorium', date: 'June 2, 2026', time: '02:00 PM',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
      status: 'Pending', registrations: 0,
      description: 'A panel discussion exploring the social, economic, and moral implications of generative AI.'
    },
    { 
      id: '102', title: 'AAU Tech Expo 2026', organizer: 'Engineering Dept',
      category: 'Tech', location: '6 Kilo - Main Hall', date: 'May 10, 2026', time: '10:00 AM',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
      status: 'Approved', registrations: 450,
      description: 'Annual campus innovation showcase featuring undergraduate engineering and tech projects.'
    },
    { 
      id: '103', title: 'Entrepreneurship Seminar', organizer: 'Business School',
      category: 'Business', location: 'Amist Kilo', date: 'May 15, 2026', time: '09:00 AM',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2',
      status: 'Approved', registrations: 520,
      description: 'Learn foundational startup strategies from local tech founders and investment groups.'
    },
    { 
      id: '104', title: 'Unregulated Flash Mob', organizer: 'Unknown Group',
      category: 'Social', location: 'Campus Quad', date: 'May 3, 2026', time: '11:30 PM',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
      status: 'Rejected', registrations: 0,
      description: 'Late-night unpermitted sound system assembly in residential quad area.'
    }
  ]);

  const [currentFilter, setCurrentFilter] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(item => item.status === currentFilter);
  }, [events, currentFilter]);

  const sortedReportEvents = useMemo(() => {
    return [...events]
      .filter(e => e.status === 'Approved') 
      .sort((a, b) => b.registrations - a.registrations);
  }, [events]);

  const mostPopular = sortedReportEvents[0];
  const leastPopular = sortedReportEvents[sortedReportEvents.length - 1];

  const handleUpdateStatus = (id: string, newStatus: 'Approved' | 'Rejected' | 'Pending') => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, status: newStatus } : ev
    ));
    setSelectedReview(null);
    Alert.alert("Status Updated", `Event status marked as ${newStatus}.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- HEADER WITH PROFILE BUTTON --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSub}>Moderation & Statistics</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.reportHeaderBtn} onPress={() => setShowReport(true)}>
              <Text style={styles.reportHeaderBtnText}>📊 Report</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.profileCircle} onPress={() => navigation.navigate('Profile')}>
              <Text style={{fontSize: 20}}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- FILTER CONTROL BAR --- */}
        <View style={styles.filterBar}>
          {(['Pending', 'Approved', 'Rejected'] as const).map((status) => (
            <TouchableOpacity 
              key={status} 
              style={[styles.filterBtn, currentFilter === status && styles.filterBtnActive]}
              onPress={() => setCurrentFilter(status)}
            >
              <Text style={[styles.filterText, currentFilter === status && { color: '#000b18' }]}>
                {status} ({events.filter(e => e.status === status).length})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- DYNAMIC EVENT LIST ROWS --- */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.eventCard} 
              onPress={() => setSelectedReview(item)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.image }} style={[styles.eventImg, { width: eventImageSize, height: eventImageSize }]} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.organizerText}>By: {item.organizer}</Text>
                {item.status === 'Approved' && (
                  <Text style={styles.regBadgeText}>👥 {item.registrations} Registered</Text>
                )}
              </View>
              <Text style={styles.inspectArrow}>→</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {currentFilter.toLowerCase()} events found.</Text>
          </View>
        )}

      </ScrollView>

      {/* --- EVENT ACTION MODAL --- */}
      <Modal visible={!!selectedReview} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalMainTitle}>{selectedReview?.title}</Text>
              <Text style={styles.modalLabel}>Organizer</Text>
              <Text style={styles.modalValue}>{selectedReview?.organizer}</Text>
              
              <Text style={styles.modalLabel}>Logistics</Text>
              <Text style={styles.modalValue}>{selectedReview?.date} @ {selectedReview?.time} • {selectedReview?.location}</Text>
              
              <Text style={styles.modalLabel}>Description</Text>
              <Text style={styles.modalDesc}>{selectedReview?.description}</Text>

              {selectedReview?.status === 'Pending' ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleUpdateStatus(selectedReview.id, 'Rejected')}>
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleUpdateStatus(selectedReview.id, 'Approved')}>
                    <LinearGradient colors={['#00d2ff', '#3a7bd5']} style={styles.gradientFill}>
                      <Text style={styles.approveBtnText}>Approve & Publish</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.statusResetRow}>
                  <Text style={styles.currentStatusNotification}>Current Status: <Text style={{fontWeight:'bold', color: selectedReview?.status === 'Approved' ? '#28a745' : '#FF3B30'}}>{selectedReview?.status}</Text></Text>
                  <TouchableOpacity style={styles.resetBtn} onPress={() => handleUpdateStatus(selectedReview.id, 'Pending')}>
                    <Text style={styles.resetBtnText}>Revert to Pending</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedReview(null)}>
                <Text style={styles.closeBtnText}>Go Back</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- ATTENDANCE PARTICIPATION REPORT MODAL --- */}
      <Modal visible={showReport} transparent animationType="fade">
        <View style={styles.modalOverlayCentered}>
          <View style={[styles.reportCardContainer, { width: reportMaxWidth }] }>
            <Text style={styles.reportHeading}>📊 Participation Insights</Text>

            {sortedReportEvents.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.insightSummaryBox}>
                  <View style={styles.insightItem}>
                    <Text style={styles.insightLabel}>🔥 Most Participants</Text>
                    <Text style={styles.insightTitle} numberOfLines={1}>{mostPopular?.title}</Text>
                    <Text style={styles.insightCount}>{mostPopular?.registrations} students</Text>
                  </View>

                  <View style={[styles.insightItem, { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginTop: 15, paddingTop: 15 }]}>
                    <Text style={styles.insightLabel}>📉 Least Participants</Text>
                    <Text style={styles.insightTitle} numberOfLines={1}>{leastPopular?.title}</Text>
                    <Text style={styles.insightCount}>{leastPopular?.registrations} students</Text>
                  </View>
                </View>

                <Text style={styles.rankSectionTitle}>All Approved Rankings</Text>
                {sortedReportEvents.map((item, index) => (
                  <View key={item.id} style={styles.rankRow}>
                    <Text style={styles.rankNum}>#{index + 1}</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.rankTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.rankOrganizer}>{item.organizer}</Text>
                    </View>
                    <Text style={styles.rankCountText}>{item.registrations} joined</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>No approved events to run statistics against yet.</Text>
            )}

            <TouchableOpacity style={styles.reportCloseBtn} onPress={() => setShowReport(false)}>
              <Text style={styles.reportCloseText}>Dismiss Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000b18' },
  scrollContent: { flexGrow: 1, paddingBottom: 100, paddingHorizontal: 20 }, // Fixes the scroll clipping
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  reportHeaderBtn: { backgroundColor: '#0c1a2b', borderWidth: 1, borderColor: '#00d2ff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  reportHeaderBtnText: { color: '#00d2ff', fontWeight: 'bold', fontSize: 13 },
  profileCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0c1a2b', justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  filterBar: { flexDirection: 'row', backgroundColor: '#0c1a2b', borderRadius: 15, padding: 5, marginBottom: 20 },
  filterBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  filterBtnActive: { backgroundColor: '#00d2ff' },
  filterText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  eventCard: { flexDirection: 'row', backgroundColor: '#0c1a2b', padding: 12, borderRadius: 20, marginBottom: 12, alignItems: 'center' },
  eventImg: { width: 60, height: 60, borderRadius: 12 },
  eventInfo: { flex: 1, marginLeft: 15 },
  eventTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  organizerText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  regBadgeText: { color: '#00d2ff', fontSize: 12, fontWeight: '600', marginTop: 4 },
  inspectArrow: { color: 'rgba(255,255,255,0.2)', fontSize: 18, marginRight: 5 },
  emptyContainer: { paddingVertical: 60, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.4)' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0c1a2b', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
  modalMainTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  modalLabel: { color: '#00d2ff', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 15, marginBottom: 4 },
  modalValue: { color: '#fff', fontSize: 15 },
  modalDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 22 },
  actionRow: { flexDirection: 'row', marginTop: 30, marginBottom: 10 },
  actionBtn: { flex: 1, height: 50, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  rejectBtn: { backgroundColor: 'rgba(255, 59, 48, 0.1)', borderWidth: 1, borderColor: '#FF3B30', marginRight: 10 },
  rejectBtnText: { color: '#FF3B30', fontWeight: 'bold' },
  approveBtn: { marginLeft: 10 },
  gradientFill: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  approveBtnText: { color: '#000b18', fontWeight: 'bold' },
  statusResetRow: { marginTop: 30, backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 15, alignItems: 'center' },
  currentStatusNotification: { color: '#fff', marginBottom: 10 },
  resetBtn: { padding: 5 },
  resetBtnText: { color: '#00d2ff', textDecorationLine: 'underline' },
  closeBtn: { marginTop: 15, padding: 10, alignItems: 'center' },
  closeBtnText: { color: 'rgba(255,255,255,0.4)' },
  modalOverlayCentered: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  reportCardContainer: { backgroundColor: '#0c1a2b', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: '#00d2ff', maxHeight: '80%' },
  reportHeading: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  insightSummaryBox: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 15, marginBottom: 20 },
  insightItem: {},
  insightLabel: { fontSize: 11, fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' },
  insightTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 3 },
  insightCount: { color: '#00d2ff', fontSize: 13, fontWeight: '600', marginTop: 1 },
  rankSectionTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  rankRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.01)', padding: 10, borderRadius: 10 },
  rankNum: { color: '#00d2ff', fontWeight: 'bold', width: 25 },
  rankTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  rankOrganizer: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  rankCountText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  reportCloseBtn: { marginTop: 20, backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 12, alignItems: 'center' },
  reportCloseText: { color: '#fff', fontWeight: 'bold' }
});

export default AdminDashboard;