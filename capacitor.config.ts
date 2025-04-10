
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fd44018ba91c479b8adb49cb440dffbf',
  appName: 'brew-buddy-explorer',
  webDir: 'dist',
  server: {
    url: 'https://fd44018b-a91c-479b-8adb-49cb440dffbf.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
    }
  },
  ios: {
    scheme: 'App'
  }
};

export default config;
