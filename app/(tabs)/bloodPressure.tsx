import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';

export default function BloodPressure() {
  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Blood Pressure</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
