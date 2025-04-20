
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useCart } from '../contexts/CartContext';
import { MenuItem } from '../types';

const OrderItem = ({ item }: { item: MenuItem }) => (
  <View style={styles.orderItem}>
    <Image source={{ uri: item.image }} style={styles.orderItemImage} />
    <View style={styles.orderItemDetails}>
      <Text style={styles.orderItemName}>{item.name}</Text>
      <Text style={styles.orderItemPrice}>${item.basePrice.toFixed(2)}</Text>
    </View>
  </View>
);

const EmptyCart = () => (
  <View style={styles.emptyCart}>
    <Feather name="shopping-cart" size={48} color="#8B5A2B" />
    <Text style={styles.emptyCartText}>Your cart is empty</Text>
  </View>
);

const mockDeliveryOptions = [
  { id: '1', label: 'Fast Delivery', price: 4.99, estimatedTime: '20-30 min' },
  { id: '2', label: 'Standard Delivery', price: 2.99, estimatedTime: '30-45 min' },
  { id: '3', label: 'Free Delivery', price: 0, estimatedTime: '45-60 min' },
];

export default function OrderScreen() {
  const navigation = useNavigation();
  const { items: cart, subtotal: total } = useCart();
  
  const handleSelectDeliveryOption = (optionId: string) => {
    console.log('Selected delivery option:', optionId);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Your Order</Text>
        
        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <View>
            {cart.map(item => (
              <OrderItem key={item.id} item={item as unknown as MenuItem} />
            ))}
            
            <View style={styles.summary}>
              <Text style={styles.summaryText}>Subtotal: ${total.toFixed(2)}</Text>
              <Text style={styles.summaryText}>Tax: ${(total * 0.10).toFixed(2)}</Text>
              <Text style={styles.summaryTotal}>Total: ${(total * 1.10).toFixed(2)}</Text>
            </View>
            
            <View style={styles.deliveryOptions}>
              <Text style={styles.deliveryTitle}>Delivery Options</Text>
              {mockDeliveryOptions.map(option => (
                <TouchableOpacity 
                  key={option.id} 
                  style={styles.deliveryOption}
                  onPress={() => handleSelectDeliveryOption(option.id)}
                >
                  <View>
                    <Text style={styles.deliveryLabel}>{option.label}</Text>
                    <Text style={styles.deliveryTime}>Estimated Time: {option.estimatedTime}</Text>
                  </View>
                  <Text style={styles.deliveryPrice}>${option.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.checkoutButton}
        onPress={() => navigation.navigate('Payment' as never)}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        <Feather name="arrow-right" size={20} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
  },
  orderItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#8B5A2B',
    fontWeight: '700',
    marginTop: 4,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  summary: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  checkoutButton: {
    backgroundColor: '#8B5A2B',
    paddingVertical: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  deliveryOptions: {
    marginTop: 20,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 8,
  },
  deliveryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  deliveryPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5A2B',
  },
});

