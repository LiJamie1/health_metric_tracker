import { useState } from 'react';
import { Button, TextInput } from 'react-native';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';
import axios from 'axios';

export default function Meals() {
  const localHost =
    'https://6701-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

  const [inputs, setInputs] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snack: '',
  });

  const handleInputChange = (
    id: keyof typeof inputs,
    input: string
  ) => {
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs };
      newInputs[id] = input;
      return newInputs;
    });
  };

  const generateInputFields = () => {
    return Object.entries(inputs).map(([key, values]) => {
      return (
        <TextInput
          key={`${key}`}
          id={`${key}`}
          style={styles.input}
          placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}`}
          onChangeText={(input) =>
            handleInputChange(key as keyof typeof inputs, input)
          }
          placeholderTextColor="#000000"
        ></TextInput>
      );
    });
  };

  const submitInput = async () => {
    try {
      await axios.post(`${localHost}/tracking/meals`, {
        ...inputs,
      });
    } catch (e: unknown) {
      console.error('submitInput', e);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {generateInputFields()}
        <Button
          key="mealsSubmit"
          title="Submit"
          onPress={submitInput}
        />
      </ThemedView>
    </ThemedView>
  );
}
