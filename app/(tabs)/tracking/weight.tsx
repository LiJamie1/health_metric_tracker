import { Button, TextInput } from 'react-native';
import { ThemedView } from 'src/components/ThemedView';
import React, { useState } from 'react';
import styles from 'src/constants/Styling';
import axios from 'axios';

export default function Weight() {
  // refresh with every new ngrok session
  const localHost =
    'https://f384-2604-3d08-517d-c600-a97a-e426-e0d5-da5c.ngrok-free.app';

  const date = new Date();

  //* INPUTS
  const [inputs, setInputs] = useState<number[]>([0, 0]);

  const handleInputChange = (
    id: 'lbs' | 'fatPercentage',
    input: string
  ) => {
    const index = id === 'lbs' ? 0 : 1;
    const parsedInput = input === '' ? 0 : parseFloat(input);
    if (isNaN(parsedInput)) {
      throw new Error('Input is not a valid number');
    }
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index] = parsedInput;
      return newInputs;
    });
  };

  //* SUBMIT
  const submitInputArray = async () => {
    try {
      await axios.post(`${localHost}/tracking/weight`, {
        date,
        inputs,
      });
      setInputs([0, 0]);
    } catch (e: unknown) {
      console.error('submitInputArray:', e);
    }
  };

  const isSubmitDisabled = inputs[0] === 0 || isNaN(inputs[0]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <TextInput
          id="Lbs"
          style={styles.input}
          placeholder="Lbs"
          keyboardType="numeric"
          onChangeText={(input) => handleInputChange('lbs', input)}
          placeholderTextColor="#000000"
        />

        <TextInput
          id="FatPercentage"
          style={styles.input}
          placeholder="Fat Percentage"
          keyboardType="numeric"
          onChangeText={(input) =>
            handleInputChange('fatPercentage', input)
          }
          placeholderTextColor="#000000"
        />

        <Button
          title="Submit"
          onPress={submitInputArray}
          disabled={isSubmitDisabled}
        />
      </ThemedView>
    </ThemedView>
  );
}
