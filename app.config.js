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
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      localNetworkIp: process.env.LOCAL_NETWORK_IP,
    },
  },
};
