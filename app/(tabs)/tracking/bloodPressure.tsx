import { useState } from 'react';
import { Button, TextInput } from 'react-native';
import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';
import axios from 'axios';

export default function BloodPressure() {
  const localHost =
    'https://6701-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

  const [isDay, setIsDay] = useState<boolean>(true);

  const toggleOnPress = () => {
    setIsDay((prevIsDay) => !isDay);
  };

  const [inputs, setInputs] = useState({
    systolic: [0, 0, 0],
    diastolic: [0, 0, 0],
    pulse: [0, 0, 0],
  });

  const handleInputChange = (
    id: keyof typeof inputs,
    index: number,
    input: string
  ) => {
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs };
      newInputs[id][index] = parseFloat(input);
      return newInputs;
    });
  };

  const generateInputFields = () => {
    return Object.entries(inputs).map(([key, values]) => {
      const displayKey = key.charAt(0).toUpperCase() + key.slice(1);
      return (
        <ThemedView key={`${key}Container`}>
          <ThemedText key={`${key}Subtitle`}>{displayKey}</ThemedText>
          <ThemedView
            key={`${key}Inputs`}
            style={styles.sideBySideInputsContainer}
          >
            {values.map((value, index) => (
              <TextInput
                key={`${key}${index}key`}
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

  const submitResultsArray = async () => {
    const finalResultsArray = Object.entries(inputs).map(
      ([key, values]) => {
        const mean =
          values.reduce((sum, val) => sum + val, 0) / values.length;
        return Math.round(mean); // Round to the nearest full digit
      }
    );

    // * Send to back -> { [mean1, mean2, mean3], true }
    try {
      await axios.post(`${localHost}/tracking/blood-pressure`, {
        finalResultsArray,
        isDay,
      });
    } catch (e: unknown) {
      console.error('submitResultsArray', e);
    }
  };

  // * Testing for state and final result
  // TODO REMOVE LATER ALONG WITH ASSOCIATED BUTTONS
  const consoleState = () => {
    console.log('inputs state', inputs);
  };

  const consoleResult = () => {
    const finalResultsArray = Object.entries(inputs).map(
      ([key, values]) => {
        const mean =
          values.reduce((sum, val) => sum + val, 0) / values.length;
        return Math.round(mean); // Round to the nearest full digit
      }
    );

    console.log(finalResultsArray);
  };

  return (
    <ThemedView key="mainContainer" style={styles.container}>
      <ThemedView key="subContainer" style={styles.content}>
        {generateInputFields()}
        <Button
          key="dayNightToggle"
          title={isDay ? 'DAY' : 'NIGHT'}
          onPress={() => toggleOnPress()}
          color={isDay ? '#007aff' : '#0020A3'}
        />
        <Button
          key="bpSubmit"
          title="Submit"
          onPress={submitResultsArray}
        />

        <Button
          key="test1Button"
          title="Log State"
          onPress={consoleState}
        />
        <Button
          key="test2Button"
          title="Log Result"
          onPress={consoleResult}
        />
      </ThemedView>
    </ThemedView>
  );
}
