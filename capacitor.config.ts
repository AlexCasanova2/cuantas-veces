import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alexcasanova.cuantasveces',
  appName: 'cuantas-veces',
  webDir: 'dist',
  server: {
    url: 'http://192.168.0.46:5173',
    cleartext: true,
    androidScheme: 'http',
    iosScheme: 'http',
    allowNavigation: ['192.168.0.46:5173']
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: true,
    scrollEnabled: true,
    backgroundColor: '#ffffff',
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
