
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Mock coffee data
const coffees = [
  {
    id: '1',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk foam',
    price: 4.99,
    image: 'https://source.unsplash.com/300x300/?cappuccino',
    category: 'hot'
  },
  {
    id: '2',
    name: 'Latte',
    description: 'Espresso with steamed milk',
    price: 5.49,
    image: 'https://source.unsplash.com/300x300/?latte',
    category: 'hot'
  },
  {
    id: '3',
    name: 'Espresso',
    description: 'Concentrated coffee served in shots',
    price: 3.99,
    image: 'https://source.unsplash.com/300x300/?espresso',
    category: 'hot'
  },
  {
    id: '4',
    name: 'Americano',
    description: 'Espresso diluted with hot water',
    price: 4.29,
    image: 'https://source.unsplash.com/300x300/?americano',
    category: 'hot'
  },
  {
    id: '5',
    name: 'Iced Coffee',
    description: 'Chilled brewed coffee with ice',
    price: 4.79,
    image: 'https://source.unsplash.com/300x300/?iced-coffee',
    category: 'cold'
  },
  {
    id: '6',
    name: 'Frappuccino',
    description: 'Blended iced coffee with whipped cream',
    price: 5.99,
    image: 'https://source.unsplash.com/300x300/?frappuccino',
    category: 'cold'
  },
  {
    id: '7',
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    price: 5.49,
    image: 'https://source.unsplash.com/300x300/?mocha',
    category: 'hot'
  },
  {
    id: '8',
    name: 'Cold Brew',
    description: 'Slowly steeped coffee served cold',
    price: 5.29,
    image: 'https://source.unsplash.com/300x300/?cold-brew',
    category: 'cold'
  }
];

const categories = [
  { id: 'all', name: 'All' },
  { id: 'hot', name: 'Hot Coffee' },
  { id: 'cold', name: 'Cold Coffee' },
  { id: 'tea', name: 'Tea' },
  { id: 'pastry', name: 'Pastries' }
];

export default function MenuScreen() {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCoffees = coffees.filter(coffee => {
    // Filter by category
    const categoryMatch = activeCategory === 'all' || coffee.category === activeCategory;
    
    // Filter by search query
    const nameMatch = coffee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = coffee.description.toLowerCase().includes(searchQuery.toLowerCase());
    const searchMatch = nameMatch || descMatch;
    
    return categoryMatch && (searchQuery === '' || searchMatch);
  });

  const addToCart = (coffeeId) => {
    // Implementation for adding to cart would go here
    console.log(`Added coffee ${coffeeId} to cart`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search coffees..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.categoryTextActive
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Coffee List */}
      <FlatList
        data={filteredCoffees}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.coffeeRow}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.coffeeCard}>
            <Image source={{ uri: item.image }} style={styles.coffeeImage} />
            <View style={styles.coffeeInfo}>
              <Text style={styles.coffeeName}>{item.name}</Text>
              <Text style={styles.coffeeDesc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.coffeeBottomRow}>
                <Text style={styles.coffeePrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(item.id)}
                >
                  <Feather name="plus" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No coffees found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  categoryButtonActive: {
    backgroundColor: '#8B5A2B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  coffeeRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  coffeeCard: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coffeeImage: {
    width: '100%',
    height: 150,
  },
  coffeeInfo: {
    padding: 12,
  },
  coffeeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  coffeeDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    height: 32,
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
  addButton: {
    backgroundColor: '#8B5A2B',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
