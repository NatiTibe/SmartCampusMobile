import React from 'react';
import { 
  StyleSheet, View, Text, FlatList, 
  TouchableOpacity, SafeAreaView, Image 
} from 'react-native';

const TRENDING_EVENTS = [
  { 
    id: '1', title: 'Film festival', category: 'Social', 
    location: '6 kilo campus', date: 'May 6th, 2026', 
    time: '3:03 AM - 6:03 AM', registrationCount: 450,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4' 
  },
  { 
    id: '2', title: 'AAU Tech Expo', category: 'Tech', 
    location: 'Main Hall', date: 'May 10th, 2026', 
    time: '10:00 AM', registrationCount: 380,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998' 
  },
];

const PopularExploreScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- HEADER --- */}
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
          data={TRENDING_EVENTS}
          keyExtractor={(item) => item.id}
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
                   onPress={() => navigation.navigate('BrowseEvents')}
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

  trendingCard: {
    backgroundColor: '#0c1a2b',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  rankBadge: {
    width: 35,
    alignItems: 'center'
  },
  rankText: { color: '#00d2ff', fontWeight: 'bold', fontSize: 16 },
  trendingImage: { width: 80, height: 80, borderRadius: 12, marginHorizontal: 15 },
  trendingInfo: { flex: 1 },
  trendingTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  trendingMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },
  detailsBtn: { marginTop: 8 },
  detailsBtnText: { color: '#3a7bd5', fontWeight: 'bold', fontSize: 12 }
});

export default PopularExploreScreen;