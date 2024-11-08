import { Button, TextInput } from 'react-native';
import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import React, { useState } from 'react';
import styles from 'src/constants/Styling';
import axios from 'axios';

export default function Weight() {
  // refresh with every new ngrok session
  const localHost =
    'https://6c72-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

  const [inputs, setInputs] = useState<any[]>([0, 0]);

  const handleInputChange = (
    id: 'lbs' | 'fatPercentage',
    input: string
  ) => {
    const index = id === 'lbs' ? 0 : 1;
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index] = parseFloat(input);
      return newInputs;
    });
  };

  const submitInputArray = async () => {
    try {
      await axios.post(`${localHost}/tracking/weight`, inputs);
    } catch (e) {
      console.error('submitInputArray:', e);
    }
  };

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
        ></TextInput>

        <TextInput
          id="FatPercentage"
          style={styles.input}
          placeholder="Fat Percentage"
          keyboardType="numeric"
          onChangeText={(input) =>
            handleInputChange('fatPercentage', input)
          }
          placeholderTextColor="#000000"
        ></TextInput>
        {/* Submit should send an array to the backend -> [lbs, fp] */}
        <Button title="Submit" onPress={submitInputArray} />
        {/* Testing purposes to see state changes */}
        <ThemedText type="default">Lbs: {inputs[0]}</ThemedText>
        <ThemedText type="default">
          Fat Percentage: {inputs[1]}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
