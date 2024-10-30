require('dotenv').config();

export default {
  expo: {
    name: 'Health_Metric_Tracker',
    slug: 'Health_Metric_Tracker',
    version: '1.0.0',
    platforms: ['android'],
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.jamieli.healthmetrictracker',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      '@react-native-google-signin/google-signin',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        localNetworkIp: process.env.LOCAL_NETWORK_IP,
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        projectId: 'c9e30459-7a2e-4333-b634-e760d0046ea9',
      },
    },
  },
};
