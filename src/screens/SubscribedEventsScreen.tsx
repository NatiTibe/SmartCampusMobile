import React from 'react';
import { 
  StyleSheet, View, Text, FlatList, 
  TouchableOpacity, SafeAreaView, Image 
} from 'react-native';

// Master list of all campus events (In a real app, this comes from your database)
const ALL_CAMPUS_EVENTS = [
  { id: '1', title: 'AAU Tech Expo', category: 'Tech', location: '6 Kilo', date: 'May 10', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4' },
  { id: '2', title: 'Film festival', category: 'Social', location: '6 Kilo campus', date: 'May 6', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4' },
  { id: '3', title: 'Python Bootcamp', category: 'Tech', location: 'Digital Library', date: 'May 12', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998' },
];

const SubscribedEventsScreen = ({ route, navigation }: any) => {
  // Retrieve the student's subscriptions passed from the Home Screen
  const { userSubscriptions } = route.params || { userSubscriptions: [] };

  // Filter the master list to only show events the student is subscribed to
  const filteredEvents = ALL_CAMPUS_EVENTS.filter(event => 
    userSubscriptions.includes(event.category)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- CUSTOM HEADER WITH BACK BUTTON --- */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My Subscriptions</Text>
            <Text style={styles.headerSub}>
              Showing events for: {userSubscriptions.join(', ')}
            </Text>
          </View>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventCard}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventMeta}>📅 {item.date} • 📍 {item.location}</Text>
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
  
  // Header Styles
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  backButton: { marginRight: 15, padding: 5 },
  backArrow: { color: '#00d2ff', fontSize: 32, fontWeight: 'bold' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },

  // Card Styles
  eventCard: {
    backgroundColor: '#0c1a2b',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardImage: { width: '100%', height: 150 },
  cardContent: { padding: 15 },
  categoryBadge: { 
    backgroundColor: 'rgba(0, 210, 255, 0.1)', 
    paddingHorizontal: 10, paddingVertical: 4, 
    borderRadius: 6, alignSelf: 'flex-start', marginBottom: 10 
  },
  categoryText: { color: '#00d2ff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  eventTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  eventMeta: { color: 'rgba(255,255,255,0.6)', fontSize: 13 }
});

export default SubscribedEventsScreen;