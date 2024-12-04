import { useState } from 'react';
import { Button, TextInput } from 'react-native';
import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';
import axios from 'axios';
import { defaultBPInput } from '@/src/constants/utils';

export default function BloodPressure() {
  const localHost =
    'https://f384-2604-3d08-517d-c600-a97a-e426-e0d5-da5c.ngrok-free.app';

  const date = new Date();

  //* INPUTS
  const [inputs, setInputs] = useState(defaultBPInput);

  const handleInputChange = (
    key: keyof typeof inputs,
    index: number,
    input: string
  ) => {
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs };
      newInputs[key][index] = input === '' ? 0 : parseFloat(input);
      return newInputs;
    });
  };

  //* SUBMIT
  const isSubmitDisabled = Object.values(inputs).some((array) =>
    array.some((value) => value === 0 || isNaN(value))
  );

  const submitResultsArray = async () => {
    const finalResultsArray = Object.entries(inputs).map(
      ([_, values]) => {
        const mean =
          values.reduce((sum, val) => sum + val, 0) / values.length;
        return Math.round(mean); // Round to the nearest full digit
      }
    );

    //* Send to back -> { [mean1, mean2, mean3], date, time, true }
    try {
      await axios.post(`${localHost}/tracking/blood-pressure`, {
        finalResultsArray,
        date,
      });
      setInputs({ ...defaultBPInput });
    } catch (e: unknown) {
      console.error('submitResultsArray', e);
    }
  };

  //* INPUT FIELDS
  const generateInputFields = () => {
    return Object.entries(inputs).map(([key, values]) => {
      const displayKey = key.charAt(0).toUpperCase() + key.slice(1);

      return (
        <ThemedView key={`${key}Container`}>
          <ThemedText>{displayKey}</ThemedText>

          <ThemedView style={styles.sideBySideInputsContainer}>
            {values.map((_, index) => (
              <TextInput
                key={`${key}${index}`} // Unique key for each TextInput
                id={`${key}${index}`}
                style={styles.sideBySideInputs}
                onChangeText={(input) =>
                  handleInputChange(
                    key as keyof typeof inputs,
                    index,
                    input
                  )
                }
                placeholder={`Entry ${index + 1}`}
                placeholderTextColor="#000000"
                keyboardType="numeric"
              />
            ))}
          </ThemedView>
        </ThemedView>
      );
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {generateInputFields()}
        <Button
          title="Submit"
          onPress={submitResultsArray}
          disabled={isSubmitDisabled}
        />
        <Button
          title="test"
          onPress={() =>
            setInputs({
              systolic: [1, 2, 3],
              diastolic: [4, 5, 6],
              pulse: [9, 8, 7],
            })
          }
        />
      </ThemedView>
    </ThemedView>
  );
}
