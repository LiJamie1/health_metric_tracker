import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import styles from '@/constants/Styling';

export default function BloodPressure() {
  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Blood Pressure</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
