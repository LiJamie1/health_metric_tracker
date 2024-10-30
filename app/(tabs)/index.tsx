import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import styles from '@/constants/Styling';
import axios from 'axios';
import { Button } from 'react-native';
import Constants from 'expo-constants';

export default function Index() {
  const localNetworkIP = Constants?.expoConfig?.extra?.localNetworkIp;
  const localHost = localNetworkIP
    ? localNetworkIP
    : 'http://localhost:5000/';
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
        <Button title="Local Host Url Test" onPress={testLocalHost} />
        <Button title="Backend Response Test" onPress={fetchData} />
      </ThemedView>
    </ThemedView>
  );
}
