
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const popularDrinks = [
  { id: '1', name: 'Cappuccino', price: '$4.99', image: 'https://source.unsplash.com/100x100/?cappuccino' },
  { id: '2', name: 'Latte', price: '$5.49', image: 'https://source.unsplash.com/100x100/?latte' },
  { id: '3', name: 'Espresso', price: '$3.99', image: 'https://source.unsplash.com/100x100/?espresso' },
  { id: '4', name: 'Mocha', price: '$5.99', image: 'https://source.unsplash.com/100x100/?mocha' },
];

const specialOffers = [
  { id: '1', title: 'Morning Deal', description: 'Get 20% off all drinks before 10 AM', badge: 'LIMITED TIME' },
  { id: '2', title: 'Happy Hour', description: 'Buy one get one free from 2-4 PM daily', badge: 'POPULAR' },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Welcome */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.nameText}>Coffee Lover</Text>
          </View>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Feather name="maximize" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://source.unsplash.com/800x400/?coffee' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Fresh Coffee</Text>
              <Text style={styles.heroSubtitle}>Start your day with our premium coffee</Text>
            </View>
            <TouchableOpacity 
              style={styles.orderButton}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Drinks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Drinks</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularDrinks}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.drinkCard}>
                <Image source={{ uri: item.image }} style={styles.drinkImage} />
                <Text style={styles.drinkName}>{item.name}</Text>
                <Text style={styles.drinkPrice}>{item.price}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Special Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          
          {specialOffers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>{offer.badge}</Text>
              </View>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDescription}>{offer.description}</Text>
            </View>
          ))}
        </View>

        {/* Nearest Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearest Location</Text>
          
          <TouchableOpacity 
            style={styles.locationCard}
            onPress={() => navigation.navigate('Locations')}
          >
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>Downtown Brew Buddy</Text>
              <Text style={styles.locationAddress}>123 Main St, Downtown</Text>
              <Text style={styles.locationHours}>Open until 9:00 PM</Text>
            </View>
            <View style={styles.locationAction}>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>0.5 mi</Text>
              </View>
              <Feather name="arrow-right" size={20} color="#8B5A2B" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#8B5A2B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBanner: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    height: 180,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'space-between',
  },
  heroTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: '#FFF',
    fontSize: 16,
  },
  orderButton: {
    backgroundColor: '#8B5A2B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  orderButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seeAllText: {
    color: '#8B5A2B',
    fontWeight: '600',
  },
  drinkCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
  },
  drinkImage: {
    width: 116,
    height: 116,
    borderRadius: 8,
    marginBottom: 8,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  drinkPrice: {
    fontSize: 14,
    color: '#8B5A2B',
    fontWeight: '700',
    marginTop: 4,
  },
  offerCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  offerBadge: {
    backgroundColor: '#8B5A2B',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  offerBadgeText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
  },
  locationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  locationHours: {
    fontSize: 12,
    color: '#8B5A2B',
  },
  locationAction: {
    alignItems: 'flex-end',
  },
  distanceBadge: {
    backgroundColor: '#E8F1FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  distanceText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '600',
  },
});
