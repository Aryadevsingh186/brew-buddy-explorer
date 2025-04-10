
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fd44018ba91c479b8adb49cb440dffbf',
  appName: 'brew-buddy-explorer',
  webDir: 'dist',
  server: {
    url: 'http://localhost:8080',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      javaVersion: "17" // Set specific Java version
    }
  },
  ios: {
    scheme: 'App'
  }
};

export default config;
