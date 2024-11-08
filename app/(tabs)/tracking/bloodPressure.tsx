import { useState } from 'react';
import { Button, TextInput } from 'react-native';
import { ThemedText } from 'src/components/ThemedText';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';

export default function BloodPressure() {
  const localHost =
    'https://6c72-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

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
        <ThemedView key={key}>
          <ThemedText>{displayKey}</ThemedText>
          {values.map((value, index) => (
            <TextInput
              key={`${key}${index}`}
              id={`${key}${index}`}
              style={styles.input}
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
      );
    });
  };

  //TODO Extract TextInput to reduce repetition
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {generateInputFields()}
        <Button
          title={isDay ? 'DAY' : 'NIGHT'}
          onPress={() => toggleOnPress()}
          color={isDay ? '#007aff' : '#0020A3'}
        />
        <Button title="Submit" />
      </ThemedView>
    </ThemedView>
  );
}
