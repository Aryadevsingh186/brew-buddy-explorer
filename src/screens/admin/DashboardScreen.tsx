
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  menuSection: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 10,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  topSection: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  orderSection: {
    padding: 16,
    marginBottom: 16,
  },
});

export default function DashboardScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to your control panel</Text>
      </View>
      
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Menu Management</Text>
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('ManageCoffees' as never)}
        >
          <Feather name="coffee" size={20} color="#8B5A2B" />
          <Text style={styles.menuItemText}>Manage Coffees</Text>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="plus-square" size={20} color="#8B5A2B" />
          <Text style={styles.menuItemText}>Add New Item</Text>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="edit" size={20} color="#8B5A2B" />
          <Text style={styles.menuItemText}>Edit Existing Item</Text>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.orderSection}>
        <Text style={styles.sectionTitle}>Order Management</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="list" size={20} color="#8B5A2B" />
          <Text style={styles.menuItemText}>View All Orders</Text>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="check-square" size={20} color="#8B5A2B" />
          <Text style={styles.menuItemText}>Fulfill Orders</Text>
          <Feather name="chevron-right" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
