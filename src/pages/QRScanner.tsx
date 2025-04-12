
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, Check, RefreshCw } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

const QRScanner: React.FC = () => {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  
  const startScanning = async () => {
    try {
      // Request camera permissions
      const permissionStatus = await CapacitorCamera.requestPermissions();
      
      if (permissionStatus.camera === 'granted') {
        setHasCameraPermission(true);
        setScanning(true);
        
        try {
          // Open the camera to scan QR code
          const image = await CapacitorCamera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            promptLabelHeader: 'Scan QR Code',
            promptLabelCancel: 'Cancel',
          });
          
          // In a real app, we would process the image to extract QR code
          // For this demo, we'll simulate finding a code
          const codes = [
            'REWARD50',
            'FREECOFFEE',
            'DISCOUNT20',
            'LOYALTYPOINTS'
          ];
          
          const randomCode = codes[Math.floor(Math.random() * codes.length)];
          setScannedCode(randomCode);
          
          toast({
            title: "QR Code Scanned",
            description: `Successfully scanned code: ${randomCode}`,
          });
        } catch (err) {
          console.error('Camera error:', err);
          toast({
            title: "Scanning Cancelled",
            description: "QR code scanning was cancelled",
          });
        }
        
        setScanning(false);
      } else {
        setHasCameraPermission(false);
        toast({
          title: "Permission Denied",
          description: "Camera permission is required to scan QR codes",
          variant: "destructive",
        });
        setScanning(false);
      }
    } catch (error) {
      console.error('Permission error:', error);
      setHasCameraPermission(false);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please allow camera permissions.",
        variant: "destructive",
      });
      setScanning(false);
    }
  };
  
  const stopScanning = () => {
    setScanning(false);
  };
  
  const resetScanner = () => {
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
    
    toast({
      title: "Code Redeemed",
      description: message,
    });
    
    setScannedCode(null);
  };
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">QR Scanner</h1>
      
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-6">
            {!scanning && !scannedCode && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Scan a QR Code</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Position the QR code within the camera frame to scan
                  </p>
                  <Button 
                    onClick={startScanning}
                    className="bg-coffee-rich hover:bg-coffee-rich/90"
                  >
                    Start Scanning
                  </Button>
                </div>
              </div>
            )}
            
            {scanning && (
              <div className="space-y-4">
                <div className="relative w-full aspect-square overflow-hidden rounded-md bg-black">
                  <div className="absolute inset-0 animate-pulse opacity-50 bg-gradient-to-b from-transparent to-background/20"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[70%] h-[70%] border-2 border-white/80 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                    </div>
                  </div>
                  
                  <div 
                    className="absolute left-[15%] w-[70%] h-0.5 bg-red-500 opacity-70"
                    style={{
                      animation: 'scanline 2s linear infinite',
                      top: '50%',
                    }}
                  ></div>
                  
                  <style>
                    {`
                    @keyframes scanline {
                      0% { transform: translateY(-100px); }
                      50% { transform: translateY(100px); }
                      100% { transform: translateY(-100px); }
                    }
                    `}
                  </style>
                </div>
                
                <Button 
                  onClick={stopScanning} 
                  variant="outline" 
                  className="w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Scan
                </Button>
              </div>
            )}
            
            {scannedCode && !scanning && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Code Scanned!</h2>
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <p className="font-mono font-semibold text-lg">{scannedCode}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={redeemCode}
                      className="bg-coffee-rich hover:bg-coffee-rich/90"
                    >
                      Redeem Code
                    </Button>
                    <Button 
                      onClick={resetScanner} 
                      variant="outline"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Scan Another Code
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-6 bg-muted rounded-lg p-4">
          <h3 className="font-semibold mb-2">How to use QR codes</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Scan QR codes at our stores to earn rewards</li>
            <li>• Redeem special offers by scanning promotional QR codes</li>
            <li>• Share your personal QR code to refer friends</li>
            <li>• Track your loyalty points with each scan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
