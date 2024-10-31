import { useEffect, useState } from 'react';
import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import { GoogleResponse } from 'src/interfaces/GoogleResponse';
import styles from 'src/constants/Styling';
import { Button } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';

export default function Index() {
  // Get Local network ip to connect via expo go app if not default to localhost
  const localHost =
    'https://4886-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        '270383151259-tb94eleqlvhm3lt4i268qdu9re98a709.apps.googleusercontent.com',
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  const emptyUserInfo = {
    data: null,
    type: 'signedOut',
  };

  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] =
    useState<GoogleResponse>(emptyUserInfo);

  const signIn = async () => {
    console.log('Pressed Sign In');

    try {
      await GoogleSignin.hasPlayServices();
      const resUserInfo = await GoogleSignin.signIn();
      setUserInfo(resUserInfo);
      setError(null);
      console.log('Sign in Successful');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      console.log(error);
    }
  };

  const logout = () => {
    setUserInfo(emptyUserInfo);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    console.log('Sign Out Successful');
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

  const consoleUserInfo = () => {
    console.log(userInfo.type);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Index</ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        {userInfo.type === 'success' ? (
          <ThemedText type="default">
            Hello {userInfo.data?.user?.name}
          </ThemedText>
        ) : (
          <ThemedText type="default">{error}</ThemedText>
        )}
        {userInfo.type === 'success' ? (
          <Button title="Logout" onPress={logout} />
        ) : (
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
          />
        )}
      </ThemedView>
      <ThemedView style={styles.content}>
        <Button title="Local Host Url Test" onPress={testLocalHost} />
        <Button title="Backend Response Test" onPress={fetchData} />
        <Button title="Check userInfo" onPress={consoleUserInfo} />
      </ThemedView>
    </ThemedView>
  );
}
