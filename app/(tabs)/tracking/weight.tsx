import { Button, TextInput } from 'react-native';
import { ThemedView } from 'src/components/ThemedView';
import React, { useState } from 'react';
import styles from 'src/constants/Styling';
import axios from 'axios';

export default function Weight() {
  // refresh with every new ngrok session
  const localHost =
    'https://f384-2604-3d08-517d-c600-a97a-e426-e0d5-da5c.ngrok-free.app';

  const [inputs, setInputs] = useState<number[]>([0, 0]);

  const handleInputChange = (
    id: 'lbs' | 'fatPercentage',
    input: string
  ) => {
    const index = id === 'lbs' ? 0 : 1;
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index] = input === '' ? 0 : parseFloat(input);
      return newInputs;
    });
  };

  const submitInputArray = async () => {
    try {
      await axios.post(`${localHost}/tracking/weight`, inputs);
      setInputs([0, 0]);
    } catch (e: unknown) {
      console.error('submitInputArray:', e);
    }
  };

  const isSubmitDisabled = !inputs.some(
    (value) => value !== 0 || isNaN(value)
  );

  //TODO Add keys to components
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <TextInput
          key="Lbs"
          id="Lbs"
          style={styles.input}
          placeholder="Lbs"
          keyboardType="numeric"
          onChangeText={(input) => handleInputChange('lbs', input)}
          placeholderTextColor="#000000"
        ></TextInput>

        <TextInput
          key="FatPercentage"
          id="FatPercentage"
          style={styles.input}
          placeholder="Fat Percentage"
          keyboardType="numeric"
          onChangeText={(input) =>
            handleInputChange('fatPercentage', input)
          }
          placeholderTextColor="#000000"
        ></TextInput>
        <Button
          title="Submit"
          onPress={submitInputArray}
          disabled={isSubmitDisabled}
        />
      </ThemedView>
    </ThemedView>
  );
}
