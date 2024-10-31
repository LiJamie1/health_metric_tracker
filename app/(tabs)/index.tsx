import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';
import { Button } from 'react-native';
import axios from 'axios';

export default function Index() {
  // Get Local network ip to connect via expo go app if not default to localhost
  const localHost =
    'https://2329-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

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
      <ThemedText type="title">Home</ThemedText>
      <ThemedView style={styles.content}>
        <Button title="Local Host Url Test" onPress={testLocalHost} />
        <Button title="Backend Response Test" onPress={fetchData} />
      </ThemedView>
    </ThemedView>
  );
}
