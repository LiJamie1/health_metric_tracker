import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import Constants from 'expo-constants';
import styles from '@/constants/Styling';

export default function Index() {
  // Get Local network ip to connect via expo go app if not default to localhost
  const LOCAL_NETWORK_IP =
    Constants?.expoConfig?.extra?.localNetworkIp;

  const localHost = LOCAL_NETWORK_IP
    ? LOCAL_NETWORK_IP
    : 'http://localhost:5000/';

  const GOOGLE_CLIENT_ID =
    Constants?.expoConfig?.extra?.googleClientId;

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<unknown>();

  const signIn = async () => {
    console.log('Pressed Sign In');

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      setError(null);
      console.log('Sign in Successful');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
  };

  const logout = () => {
    setUserInfo(undefined);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  };

  // Get Axios Response from "/" endpoint declared in backend/src/index.ts
  const fetchData = async () => {
    try {
      const response = await axios.get(`${localHost}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const testLocalHost = () => {
    console.log(localHost);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Index</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText type="default">{error}</ThemedText>
        {userInfo ? (
          <Button title="Logout" onPress={logout} />
        ) : (
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
          />
        )}
        <ExpoStatusBar style="auto" />
      </ThemedView>
      <ThemedView style={styles.content}>
        <Button title="Local Host Url Test" onPress={testLocalHost} />
        <Button title="Backend Response Test" onPress={fetchData} />
      </ThemedView>
    </ThemedView>
  );
}
