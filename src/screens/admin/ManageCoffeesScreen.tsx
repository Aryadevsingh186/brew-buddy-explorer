
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Sample coffee data - in a real app this would come from an API
const initialCoffees = [
  {
    id: '1',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 4.99,
    image: 'https://source.unsplash.com/100x100/?cappuccino',
    category: 'hot',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Latte',
    description: 'Espresso with steamed milk',
    price: 5.49,
    image: 'https://source.unsplash.com/100x100/?latte',
    category: 'hot',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Espresso',
    description: 'Concentrated coffee served in shots',
    price: 3.99,
    image: 'https://source.unsplash.com/100x100/?espresso',
    category: 'hot',
    isAvailable: false
  },
  {
    id: '4',
    name: 'Cold Brew',
    description: 'Slowly steeped coffee served cold',
    price: 5.29,
    image: 'https://source.unsplash.com/100x100/?cold-brew',
    category: 'cold',
    isAvailable: true
  }
];

export default function ManageCoffeesScreen() {
  const [coffees, setCoffees] = useState(initialCoffees);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentCoffee, setCurrentCoffee] = useState(null);
  
  // Filter coffees based on search query
  const filteredCoffees = coffees.filter(coffee => 
    coffee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coffee.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleToggleAvailability = (id) => {
    setCoffees(prevCoffees => 
      prevCoffees.map(coffee => 
        coffee.id === id ? { ...coffee, isAvailable: !coffee.isAvailable } : coffee
      )
    );
  };
  
  const handleEditCoffee = (coffee) => {
    setCurrentCoffee(coffee);
    setIsEditModalVisible(true);
  };
  
  const handleDeleteCoffee = (id) => {
    Alert.alert(
      'Delete Coffee',
      'Are you sure you want to delete this coffee?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { 
          text: 'Delete', 
          onPress: () => {
            setCoffees(prevCoffees => prevCoffees.filter(coffee => coffee.id !== id));
          },
          style: 'destructive'
        },
      ]
    );
  };
  
  const handleAddNewCoffee = () => {
    Alert.alert('Add Coffee', 'This would open a form to add a new coffee');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Coffees</Text>
      </View>
      
      {/* Search and Action Row */}
      <View style={styles.actionRow}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search coffees..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddNewCoffee}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      {/* Coffee list */}
      <ScrollView style={styles.listContainer}>
        {filteredCoffees.map((coffee) => (
          <View key={coffee.id} style={styles.coffeeCard}>
            <Image source={{ uri: coffee.image }} style={styles.coffeeImage} />
            
            <View style={styles.coffeeDetails}>
              <View style={styles.coffeeNameRow}>
                <Text style={styles.coffeeName}>{coffee.name}</Text>
                <View style={[
                  styles.availabilityBadge,
                  coffee.isAvailable ? styles.availableBadge : styles.unavailableBadge
                ]}>
                  <Text style={[
                    styles.availabilityText,
                    coffee.isAvailable ? styles.availableText : styles.unavailableText
                  ]}>
                    {coffee.isAvailable ? 'Available' : 'Unavailable'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.coffeeDescription} numberOfLines={2}>
                {coffee.description}
              </Text>
              
              <View style={styles.coffeeBottomRow}>
                <Text style={styles.coffeePrice}>${coffee.price.toFixed(2)}</Text>
                <View style={styles.coffeeActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleToggleAvailability(coffee.id)}
                  >
                    <Feather 
                      name={coffee.isAvailable ? "toggle-right" : "toggle-left"} 
                      size={20} 
                      color={coffee.isAvailable ? "#2ECC71" : "#999"}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditCoffee(coffee)}
                  >
                    <Feather name="edit-2" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteCoffee(coffee.id)}
                  >
                    <Feather name="trash-2" size={20} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
        
        {filteredCoffees.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="coffee" size={64} color="#DDD" />
            <Text style={styles.emptyStateText}>No coffees found</Text>
          </View>
        )}
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  coffeeCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
  },
  coffeeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  coffeeDetails: {
    flex: 1,
    marginLeft: 12,
  },
  coffeeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  coffeeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#2ECC71',
  },
  unavailableText: {
    color: '#E74C3C',
  },
  coffeeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  coffeeBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coffeePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  coffeeActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
