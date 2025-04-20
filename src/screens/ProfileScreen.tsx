
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  
  // Mock user data - in a real app would come from AuthContext
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    points: 320,
    level: 'Gold',
    joinDate: 'January 2023',
    avatar: 'https://i.pravatar.cc/300'
  };

  // Menu sections
  const accountMenuItems = [
    { icon: 'user', label: 'Account Information', onPress: () => Alert.alert('Account Info', 'This would open account details') },
    { icon: 'credit-card', label: 'Payment Methods', onPress: () => Alert.alert('Payment Methods', 'This would open payment options') },
    { icon: 'map-pin', label: 'Saved Addresses', onPress: () => Alert.alert('Addresses', 'This would show your saved addresses') },
    { icon: 'bell', label: 'Notification Preferences', onPress: () => Alert.alert('Notifications', 'This would open notification settings') },
    { icon: 'lock', label: 'Privacy & Security', onPress: () => Alert.alert('Privacy', 'This would open privacy settings') }
  ];

  const orderMenuItems = [
    { icon: 'clock', label: 'Order History', onPress: () => Alert.alert('Order History', 'This would show your past orders') },
    { icon: 'repeat', label: 'Reorder Favorites', onPress: () => Alert.alert('Favorites', 'This would show your favorite orders') },
    { icon: 'heart', label: 'Saved Items', onPress: () => Alert.alert('Saved', 'This would show your saved items') }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', onPress: () => {
          logout();
          navigation.navigate('Auth');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          
          <View style={styles.pointsCard}>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Loyalty Points</Text>
              <Text style={styles.pointsValue}>{userData.points}</Text>
            </View>
            
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{userData.level} Member</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.progressText}>180 points until Platinum level</Text>
          </View>
        </View>
        
        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {accountMenuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Feather name={item.icon} size={20} color="#666" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Orders & Favorites */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders & Favorites</Text>
          
          {orderMenuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Feather name={item.icon} size={20} color="#666" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
              <Feather name="bell" size={20} color="#666" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E0E0E0', true: '#8B5A2B' }}
              thumbColor="#FFF"
            />
          </View>
          
          <View style={styles.toggleItem}>
            <View style={styles.toggleItemLeft}>
              <Feather name="mail" size={20} color="#666" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E0E0E0', true: '#8B5A2B' }}
              thumbColor="#FFF"
            />
          </View>
        </View>
        
        {/* About & Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Help</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="info" size={20} color="#666" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>About Brew Buddy</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="help-circle" size={20} color="#666" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Feather name="file-text" size={20} color="#666" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Terms & Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#FF6B6B" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Brew Buddy v1.0.0</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  pointsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: '100%',
  },
  pointsInfo: {},
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5A2B',
  },
  levelBadge: {
    backgroundColor: '#8B5A2B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  levelText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  progressContainer: {
    width: '100%',
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5A2B',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  versionInfo: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});
