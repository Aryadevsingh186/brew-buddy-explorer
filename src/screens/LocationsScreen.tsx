
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Mock coffee shop data
const coffeeShops = [
  {
    id: 1,
    name: "Downtown Brew Buddy",
    address: "123 Main St, Downtown",
    distance: 0.5,
    rating: 4.8,
    hours: "7:00 AM - 9:00 PM",
    phone: "555-123-4567",
    features: ["Drive-thru", "Patio", "WiFi"]
  },
  {
    id: 2,
    name: "University Corner",
    address: "45 College Ave, University District",
    distance: 1.2,
    rating: 4.6,
    hours: "6:00 AM - 11:00 PM",
    phone: "555-987-6543",
    features: ["Study Room", "24/7", "WiFi"]
  },
  {
    id: 3,
    name: "Westside Roasters",
    address: "789 Market St, Westside",
    distance: 2.4,
    rating: 4.9,
    hours: "8:00 AM - 8:00 PM",
    phone: "555-456-7890",
    features: ["Roastery Tour", "Outdoor Seating", "Dog Friendly"]
  },
  {
    id: 4,
    name: "Eastside Coffee Hub",
    address: "321 Commerce Blvd, Eastside",
    distance: 3.7,
    rating: 4.5,
    hours: "6:30 AM - 7:00 PM",
    phone: "555-789-0123",
    features: ["Drive-thru", "Bakery", "Parking"]
  }
];

export default function LocationsScreen() {
  const [locations, setLocations] = useState(coffeeShops);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const findNearbyLocations = () => {
    setIsLoadingLocation(true);
    
    // Simulate geolocation request
    setTimeout(() => {
      setIsLoadingLocation(false);
      Alert.alert('Location Updated', 'Found 4 coffee shops near you');
    }, 1500);
  };
  
  const getDirections = (location) => {
    Alert.alert(
      'Get Directions',
      `Would you like to get directions to ${location.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { 
          text: 'Yes', 
          onPress: () => {
            // In a real app, this would open maps/navigation
            Alert.alert('Opening Maps', 'This would open your map app with directions');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Coffee Shop Locations</Text>
      </View>
      
      {/* Map placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Interactive Map</Text>
          <Text style={styles.mapSubtext}>(Map would be displayed here)</Text>
          
          {locations.map(location => (
            <View 
              key={location.id} 
              style={[
                styles.mapMarker,
                { 
                  top: `${20 + Math.random() * 60}%`, 
                  left: `${20 + Math.random() * 60}%` 
                }
              ]}
            >
              <View style={styles.markerDot} />
              <Text style={styles.markerLabel}>{location.name}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={findNearbyLocations}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Feather name="navigation" size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
      
      {/* Location List */}
      <ScrollView style={styles.locationsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Nearby Locations</Text>
        
        {locations.map(location => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.locationCard,
              selectedLocation?.id === location.id && styles.selectedLocationCard
            ]}
            onPress={() => setSelectedLocation(location)}
          >
            <View style={styles.locationHeader}>
              <View>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationAddress}>{location.address}</Text>
              </View>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{location.distance} mi</Text>
              </View>
            </View>
            
            <View style={styles.locationDetails}>
              <View style={styles.detailRow}>
                <Feather name="star" size={16} color="#FFB800" style={styles.detailIcon} />
                <Text style={styles.detailText}>{location.rating} Rating</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Feather name="clock" size={16} color="#666" style={styles.detailIcon} />
                <Text style={styles.detailText}>{location.hours}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Feather name="phone" size={16} color="#666" style={styles.detailIcon} />
                <Text style={styles.detailText}>{location.phone}</Text>
              </View>
              
              <View style={styles.featuresContainer}>
                {location.features.map((feature, index) => (
                  <View key={index} style={styles.featureBadge}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => getDirections(location)}
              >
                <Feather name="navigation" size={16} color="#FFF" style={styles.directionsIcon} />
                <Text style={styles.directionsText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  mapContainer: {
    height: 200,
    position: 'relative',
  },
  mapPlaceholder: {
    backgroundColor: '#E8F1FD',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#4A90E2',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5A2B',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  markerLabel: {
    fontSize: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  currentLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#8B5A2B',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  locationsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  locationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  selectedLocationCard: {
    borderColor: '#8B5A2B',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  distanceBadge: {
    backgroundColor: '#E8F1FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '600',
  },
  locationDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 12,
  },
  featureBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
  },
  directionsButton: {
    backgroundColor: '#8B5A2B',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionsIcon: {
    marginRight: 8,
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});
