
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // Simulate different QR codes for demo purposes
    const codes = ['REWARD50', 'FREECOFFEE', 'DISCOUNT20', 'LOYALTYPOINTS'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    
    setScannedCode(randomCode);
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedCode(null);
  };

  const redeemCode = () => {
    if (!scannedCode) return;
    
    let message = "";
    
    switch (scannedCode) {
      case 'REWARD50':
        message = "You've earned 50 reward points!";
        break;
      case 'FREECOFFEE':
        message = "You've redeemed a free coffee!";
        break;
      case 'DISCOUNT20':
        message = "You've activated a 20% discount on your next order!";
        break;
      case 'LOYALTYPOINTS':
        message = "You've earned 100 loyalty points!";
        break;
      default:
        message = "Code redeemed successfully!";
    }
    
    Alert.alert('Success', message, [
      {
        text: 'OK',
        onPress: () => {
          resetScanner();
          navigation.goBack();
        }
      }
    ]);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5A2B" />
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredContainer}>
          <Feather name="camera-off" size={64} color="#999" />
          <Text style={styles.permissionText}>Camera permission not granted</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.permissionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="x" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {!scanned ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back as any}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.overlay}>
              <View style={styles.scanWindow}>
                <View style={[styles.cornerTL, styles.corner]} />
                <View style={[styles.cornerTR, styles.corner]} />
                <View style={[styles.cornerBL, styles.corner]} />
                <View style={[styles.cornerBR, styles.corner]} />
                
                {/* Scanline animation */}
                <View style={styles.scanline} />
              </View>
            </View>
          </Camera>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Feather name="check" size={32} color="#FFF" />
            </View>
            <Text style={styles.successText}>Code Scanned!</Text>
          </View>
          
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Your Code</Text>
            <Text style={styles.codeValue}>{scannedCode}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.redeemButton}
              onPress={redeemCode}
            >
              <Text style={styles.redeemButtonText}>Redeem Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={resetScanner}
            >
              <Feather name="rotate-ccw" size={16} color="#8B5A2B" style={styles.scanAgainIcon} />
              <Text style={styles.scanAgainText}>Scan Another Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to scan</Text>
        <View style={styles.instructionStep}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>1</Text>
          </View>
          <Text style={styles.instructionText}>
            Position the QR code within the frame
          </Text>
        </View>
        <View style={styles.instructionStep}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>2</Text>
          </View>
          <Text style={styles.instructionText}>
            Hold steady until the code is recognized
          </Text>
        </View>
        <View style={styles.instructionStep}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>3</Text>
          </View>
          <Text style={styles.instructionText}>
            Redeem your rewards instantly
          </Text>
        </View>
      </View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  permissionButton: {
    backgroundColor: '#8B5A2B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanWindow: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FFF',
    borderWidth: 3,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanline: {
    position: 'absolute',
    height: 2,
    width: '100%',
    backgroundColor: '#8B5A2B',
    top: '50%',
  },
  resultContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  codeContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5A2B',
    textAlign: 'center',
    letterSpacing: 2,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  redeemButton: {
    backgroundColor: '#8B5A2B',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanAgainIcon: {
    marginRight: 8,
  },
  scanAgainText: {
    fontSize: 16,
    color: '#8B5A2B',
    fontWeight: '600',
  },
  instructions: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
  },
});
