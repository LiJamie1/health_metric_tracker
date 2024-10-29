import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import styles from '@/constants/Styling';

export default function Meals() {
  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Meals</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
