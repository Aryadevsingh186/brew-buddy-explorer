
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();

  // Sample analytics data
  const salesData = {
    today: 1254.99,
    weekly: 8945.75,
    monthly: 32568.50
  };
  
  const popularItems = [
    { name: 'Cappuccino', count: 78 },
    { name: 'Latte', count: 65 },
    { name: 'Espresso', count: 54 },
    { name: 'Cold Brew', count: 42 },
    { name: 'Mocha', count: 36 }
  ];
  
  const recentOrders = [
    { id: '#45782', customer: 'Sarah Johnson', amount: 15.99, time: '10 mins ago', status: 'Completed' },
    { id: '#45781', customer: 'Mike Andrews', amount: 22.50, time: '25 mins ago', status: 'Preparing' },
    { id: '#45780', customer: 'Emily Wilson', amount: 9.75, time: '45 mins ago', status: 'Completed' },
    { id: '#45779', customer: 'David Clark', amount: 18.25, time: '1 hour ago', status: 'Completed' },
    { id: '#45778', customer: 'Lisa Freeman', amount: 12.50, time: '2 hours ago', status: 'Cancelled' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome back, Admin!</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={24} color="#333" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('ManageCoffees')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFE8D6' }]}>
                <Feather name="coffee" size={20} color="#8B5A2B" />
              </View>
              <Text style={styles.actionText}>Manage Products</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#E8F4FF' }]}>
                <Feather name="shopping-bag" size={20} color="#4A90E2" />
              </View>
              <Text style={styles.actionText}>View Orders</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#E6F7ED' }]}>
                <Feather name="users" size={20} color="#2ECC71" />
              </View>
              <Text style={styles.actionText}>Customers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FCF3CF' }]}>
                <Feather name="settings" size={20} color="#F1C40F" />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sales Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Overview</Text>
          <View style={styles.salesGrid}>
            <View style={styles.salesCard}>
              <Text style={styles.salesLabel}>Today</Text>
              <Text style={styles.salesValue}>${salesData.today.toFixed(2)}</Text>
              <View style={[styles.trendIndicator, styles.trendUp]}>
                <Feather name="arrow-up-right" size={14} color="#2ECC71" />
                <Text style={[styles.trendText, styles.trendTextUp]}>+12%</Text>
              </View>
            </View>
            
            <View style={styles.salesCard}>
              <Text style={styles.salesLabel}>This Week</Text>
              <Text style={styles.salesValue}>${salesData.weekly.toFixed(2)}</Text>
              <View style={[styles.trendIndicator, styles.trendUp]}>
                <Feather name="arrow-up-right" size={14} color="#2ECC71" />
                <Text style={[styles.trendText, styles.trendTextUp]}>+8%</Text>
              </View>
            </View>
            
            <View style={styles.salesCard}>
              <Text style={styles.salesLabel}>This Month</Text>
              <Text style={styles.salesValue}>${salesData.monthly.toFixed(2)}</Text>
              <View style={[styles.trendIndicator, styles.trendDown]}>
                <Feather name="arrow-down-right" size={14} color="#E74C3C" />
                <Text style={[styles.trendText, styles.trendTextDown]}>-3%</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Most Popular Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Popular Items</Text>
          <View style={styles.popularItemsContainer}>
            {popularItems.map((item, index) => (
              <View key={index} style={styles.popularItem}>
                <View style={styles.popularItemRank}>
                  <Text style={styles.popularItemRankText}>#{index + 1}</Text>
                </View>
                <Text style={styles.popularItemName}>{item.name}</Text>
                <Text style={styles.popularItemCount}>{item.count} sold</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentOrders.map((order, index) => (
            <View key={index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={[
                  styles.orderStatus,
                  order.status === 'Completed' ? styles.statusCompleted :
                  order.status === 'Preparing' ? styles.statusPreparing :
                  styles.statusCancelled
                ]}>
                  <Text style={styles.orderStatusText}>{order.status}</Text>
                </View>
              </View>
              
              <View style={styles.orderDetails}>
                <View>
                  <Text style={styles.orderCustomer}>{order.customer}</Text>
                  <Text style={styles.orderTime}>{order.time}</Text>
                </View>
                <Text style={styles.orderAmount}>${order.amount.toFixed(2)}</Text>
              </View>
            </View>
          ))}
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E74C3C',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A2B',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  salesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salesCard: {
    width: '32%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
  },
  salesLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  salesValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trendUp: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  trendDown: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  trendTextUp: {
    color: '#2ECC71',
  },
  trendTextDown: {
    color: '#E74C3C',
  },
  popularItemsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  popularItemRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  popularItemRankText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  popularItemName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  popularItemCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A2B',
  },
  orderCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  orderStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  statusPreparing: {
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCustomer: {
    fontSize: 14,
    color: '#333',
  },
  orderTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5A2B',
  },
});
