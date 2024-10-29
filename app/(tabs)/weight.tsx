import {
  Button,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';

export default function Weight() {
  // Define Inputs Object
  interface Inputs {
    Date: string;
    Lbs: string;
    FatPercentage: string;
  }

  // Gets Date information
  const currentDate: Date = new Date();
  const formattedDate: string = currentDate.toLocaleDateString();

  const [inputs, setInputs] = useState<Inputs>({
    Date: formattedDate,
    Lbs: '',
    FatPercentage: '',
  });

  // Handle TextInput changes
  const handleDateChange = (date: string) => {
    setInputs((prevInput) => ({
      ...prevInput,
      Date: date,
    }));
  };

  const handleLbsChange = (lbs: string) => {
    setInputs((prevInput) => ({
      ...prevInput,
      Lbs: lbs,
    }));
  };
  const handleFatPercentageChange = (fatPercentage: string) => {
    setInputs((prevInput) => ({
      ...prevInput,
      FatPercentage: fatPercentage,
    }));
  };

  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Weight</ThemedText>
      </ThemedView>
      <ThemedView>
        <TextInput
          id="Date"
          style={styles.input}
          value={formattedDate}
          onChangeText={handleDateChange}
        ></TextInput>
        <TextInput
          id="Lbs"
          style={styles.input}
          placeholder="Lbs"
          keyboardType="numeric"
          onChangeText={handleLbsChange}
        ></TextInput>
        <TextInput
          id="FatPercentage"
          style={styles.input}
          placeholder="Fat Percentage"
          keyboardType="numeric"
          onChangeText={handleFatPercentageChange}
        ></TextInput>
        <Button title="Update" />
        <ThemedText type="default">Date: {inputs.Date}</ThemedText>
        <ThemedText type="default">Lbs: {inputs.Lbs}</ThemedText>
        <ThemedText type="default">
          Fat Percentage: {inputs.FatPercentage}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  mainBody: {},
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#faf7f5',
    color: '#958e8b',
  },
});
