import { Button, TextInput } from 'react-native';
import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import React, { useState } from 'react';
import styles from 'src/constants/Styling';

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
  const handleInputChange = (field: keyof Inputs, value: string) => {
    setInputs((prevInput) => ({
      ...prevInput,
      [field]: value,
    }));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <TextInput
          id="Date"
          style={styles.input}
          value={formattedDate}
          onChangeText={(text) => handleInputChange('Date', text)}
          placeholderTextColor="#000000"
        ></TextInput>

        <TextInput
          id="Lbs"
          style={styles.input}
          placeholder="Lbs"
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange('Lbs', text)}
          placeholderTextColor="#000000"
        ></TextInput>

        <TextInput
          id="FatPercentage"
          style={styles.input}
          placeholder="Fat Percentage"
          keyboardType="numeric"
          onChangeText={(text) =>
            handleInputChange('FatPercentage', text)
          }
          placeholderTextColor="#000000"
        ></TextInput>
        <Button title="Submit" />
        {/* Testing purposes to see state changes */}
        <ThemedText type="default">Date: {inputs.Date}</ThemedText>
        <ThemedText type="default">Lbs: {inputs.Lbs}</ThemedText>
        <ThemedText type="default">
          Fat Percentage: {inputs.FatPercentage}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
