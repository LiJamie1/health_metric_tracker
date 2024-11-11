import { useEffect, useState } from 'react';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';
import { Button } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';

export default function Index() {
  // refresh with every new ngrok session
  const localHost =
    'https://6701-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        '270383151259-tb94eleqlvhm3lt4i268qdu9re98a709.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  });

  const [signinStatus, setSigninStatus] = useState('signedOut');

  const sendDataToBackend = async (serverAuthCode: string | null) => {
    try {
      const response = await axios.post(
        `${localHost}/api/auth/google`,
        {
          serverAuthCode,
        }
      );
      console.log('Sign in success:', response.data.message);
    } catch (e: unknown) {
      console.error('Sign in failed:', e);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const googleResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(googleResponse)) {
        const {
          type,
          data: { serverAuthCode },
        } = googleResponse;

        setSigninStatus(type);

        sendDataToBackend(serverAuthCode);
      }
    } catch (e: unknown) {
      console.error('signIn:', e);
    }
  };

  const logout = () => {
    setSigninStatus('signedOut');
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    console.log('Sign Out Successful');
  };

  //TODO Add keys to components
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
    </ThemedView>
  );
}
