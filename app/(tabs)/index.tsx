import { useEffect, useState } from 'react';
import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';
import { Button } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
// interface for google response
// import { GoogleResponse } from 'src/interfaces/GoogleResponse';

export default function Index() {
  // refresh with every new ngrok session
  const localHost =
    'https://b202-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        '270383151259-tb94eleqlvhm3lt4i268qdu9re98a709.apps.googleusercontent.com',
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      ],
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  // const emptyUserInfo = {
  //   data: null,
  //   type: 'signedOut',
  // };

  const [error, setError] = useState<string | null>(null);
  // Remove state for userInfo
  // Currently no reason to hold on to this
  // const [userInfo, setUserInfo] =
  //   useState<GoogleResponse>(emptyUserInfo);
  const [signinStatus, setSigninStatus] = useState('signedOut');

  const sendDataToBackend = async (
    serverAuthCode: string | null,
    idToken: string | null,
    email: string
  ) => {
    try {
      // make a post to /api/auth/google later for now just testing with /receive
      const response = await axios.post(`${localHost}/receive`, {
        serverAuthCode,
        idToken,
        email,
      });
      console.log(response.data);
    } catch (e) {
      console.error('sendDataToBackend:', e);
    }
  };

  const signIn = async () => {
    console.log('Pressed Sign In');

    try {
      await GoogleSignin.hasPlayServices();
      const googleResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(googleResponse)) {
        const {
          type,
          data: {
            idToken,
            serverAuthCode,
            user: { email },
          },
        } = googleResponse;
        setSigninStatus(type);
        setError(null);

        sendDataToBackend(idToken, serverAuthCode, email);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      console.log('signIn:', error);
    }
  };

  const logout = () => {
    setSigninStatus('signedOut');
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    console.log('Sign Out Successful');
  };

  const fetchEmailTest = async () => {
    try {
      const response = await axios.get(`${localHost}/emailFromBack`);
      console.log(response.data);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {signinStatus === 'success' ? (
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
        <Button
          title="Email from Back End"
          onPress={fetchEmailTest}
        />
      </ThemedView>
    </ThemedView>
  );
}
