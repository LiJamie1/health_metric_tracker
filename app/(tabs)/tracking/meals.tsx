import { useState } from 'react';
import { Button, Pressable, TextInput } from 'react-native';
import { ThemedView } from 'src/components/ThemedView';
import { ThemedText } from '@/src/components/ThemedText';
import styles from 'src/constants/Styling';
import axios from 'axios';

export default function Meals() {
  const localHost =
    'https://f384-2604-3d08-517d-c600-a97a-e426-e0d5-da5c.ngrok-free.app';

  const formattedDate: string = new Date().toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }
  );

  const [date, setDate] = useState(`${formattedDate}`);

  const [inputs, setInputs] = useState({
    breakfast: {
      stringInput: '',
      format: false,
    },
    lunch: {
      stringInput: '',
      format: false,
    },
    dinner: {
      stringInput: '',
      format: false,
    },
    snack: {
      stringInput: '',
      format: false,
    },
  });

  const handleMealInputChange = (
    key: keyof typeof inputs,
    input: string
  ) => {
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs };
      newInputs[key].stringInput = input;
      return newInputs;
    });
  };

  const onFormatPress = (key: keyof typeof inputs) => {
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs };
      inputs[key].format = !inputs[key].format;
      return newInputs;
    });
  };

  const generateInputFields = () => {
    return Object.entries(inputs).map(
      ([key, { stringInput, format }]) => {
        const placeholderText = `${key.charAt(0).toUpperCase() + key.slice(1)}`;
        const buttonStyle = {
          ...styles.mealButton,
          backgroundColor: format ? '#63646a' : '#414246',
        };

        return (
          <ThemedView
            style={styles.mealSideBySideContainer}
            key={key}
          >
            <TextInput
              id={key}
              style={styles.mealInput}
              placeholder={placeholderText}
              value={stringInput}
              onChangeText={(userInput) =>
                handleMealInputChange(
                  key as keyof typeof inputs,
                  userInput
                )
              }
              placeholderTextColor="#5f6670"
            />
            <Pressable
              style={buttonStyle}
              onPress={() =>
                onFormatPress(key as keyof typeof inputs)
              }
            >
              <ThemedText>{format ? 'Out' : 'Home'}</ThemedText>
            </Pressable>
          </ThemedView>
        );
      }
    );
  };

  const submitInput = async () => {
    try {
      await axios.post(`${localHost}/tracking/meals`, {
        date,
        inputs,
      });
    } catch (e: unknown) {
      console.error('submitInput', e);
    }
  };

  //TODO Refactor/Remove when implementing react native date picker
  const handleDateChange = (userInput: string) => {
    const isValidDate = Date.parse(userInput); // Check if the input is a valid date format
    if (isValidDate) {
      const newDate = new Date(userInput).toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }
      );
      setDate(newDate);
    } else {
      console.error('Invalid date format');
    }
  };

  const inputsEmpty = !Object.values(inputs).some(
    (input) => input.stringInput !== ''
  );

  const isSubmitDisabled = inputsEmpty;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <TextInput
          id="date"
          style={styles.input}
          placeholder={date}
          onChangeText={handleDateChange}
        ></TextInput>
        {generateInputFields()}
        <Button
          key="mealsSubmit"
          title="Submit"
          onPress={submitInput}
          disabled={isSubmitDisabled}
        />
        <Button
          title="test state"
          onPress={() => console.log(date, inputs)}
        />
      </ThemedView>
    </ThemedView>
  );
}
