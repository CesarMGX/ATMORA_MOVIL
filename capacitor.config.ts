import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ATMORA-APP',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // ESTE ES TU ID REAL
      serverClientId: '260943439033-s02n43med5qq3mkdb8bdje110q39kt97.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;