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

  const [inputs, setInputs] = useState({
    date: formattedDate,
    breakfast: '',
    lunch: '',
    dinner: '',
    snack: '',
  });

  const [formatOptions, setFormatOptions] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false,
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

  const onFormatPress = (key: keyof typeof formatOptions) => {
    setFormatOptions((prevFormatOptions) => {
      let newFormatOptions = { ...prevFormatOptions };
      newFormatOptions[key] = !newFormatOptions[key];
      return newFormatOptions;
    });
  };

  const generateInputFields = () => {
    return Object.entries(inputs).map(([key, values]) => {
      const formatKey = key as keyof typeof formatOptions;
      const value = values;
      const isDateKey = key === 'date';
      const containerStyle = isDateKey
        ? {}
        : styles.mealSideBySideContainer;
      const inputStyle = isDateKey ? styles.input : styles.mealInput;
      const placeholderText = isDateKey
        ? values
        : `${key.charAt(0).toUpperCase() + key.slice(1)}`;
      const buttonStyle = {
        ...styles.mealButton,
        backgroundColor: formatOptions[formatKey]
          ? '#63646a'
          : '#414246',
      };

      return (
        <ThemedView style={containerStyle} key={key}>
          <TextInput
            id={key}
            style={inputStyle}
            placeholder={placeholderText}
            value={value}
            onChangeText={(input) =>
              handleInputChange(key as keyof typeof inputs, input)
            }
            placeholderTextColor="#5f6670"
          />
          {!isDateKey && (
            <Pressable
              style={buttonStyle}
              onPress={() => onFormatPress(formatKey)}
            >
              <ThemedText>
                {formatOptions[formatKey] ? 'Out' : 'Home'}
              </ThemedText>
            </Pressable>
          )}
        </ThemedView>
      );
    });
  };

  const submitInput = async () => {
    try {
      await axios.post(`${localHost}/tracking/meals`, {
        ...inputs,
      });
      setInputs({
        date: formattedDate,
        breakfast: '',
        lunch: '',
        dinner: '',
        snack: '',
      });
      setFormatOptions({
        breakfast: false,
        lunch: false,
        dinner: false,
        snack: false,
      });
    } catch (e: unknown) {
      console.error('submitInput', e);
    }
  };

  const isSubmitDisabled = !Object.values(inputs)
    .slice(1)
    .some((value) => value !== '');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {generateInputFields()}
        <Button
          key="mealsSubmit"
          title="Submit"
          onPress={submitInput}
          disabled={isSubmitDisabled}
        />
      </ThemedView>
    </ThemedView>
  );
}
