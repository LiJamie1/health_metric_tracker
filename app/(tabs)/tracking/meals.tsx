import { useState } from 'react';
import { Button, Pressable, TextInput } from 'react-native';
import { ThemedView } from 'src/components/ThemedView';
import styles from 'src/constants/Styling';
import axios from 'axios';
import { ThemedText } from '@/src/components/ThemedText';

export default function Meals() {
  const localHost =
    'https://6701-2604-3d08-517d-c600-18aa-1995-6c79-59fe.ngrok-free.app';

  const formattedDate: string = new Date().toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }
  );

  const [inputs, setInputs] = useState({
    date: '',
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
    console.log(formatOptions);
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

  //TODO add formatting option
  const generateInputFields = () => {
    return Object.entries(inputs).map(([key, values]) => {
      const formatKey = `${key}` as keyof typeof formatOptions;
      const containerStyle =
        key === 'date' ? {} : styles.mealSideBySideContainer;
      const inputStyle =
        key === 'date' ? styles.input : styles.mealInput;
      const placeholderText =
        key === 'date'
          ? formattedDate
          : `${key.charAt(0).toUpperCase() + key.slice(1)}`;

      return (
        <ThemedView style={containerStyle} key={key}>
          <TextInput
            id={key}
            style={inputStyle}
            placeholder={placeholderText}
            onChangeText={(input) =>
              handleInputChange(key as keyof typeof inputs, input)
            } // No need for `${key}`
            placeholderTextColor="#5f6670"
          />
          {key !== 'date' && (
            <Pressable
              style={{
                ...styles.mealButton,
                backgroundColor: formatOptions[formatKey]
                  ? '#63646a'
                  : '#414246',
              }}
              onPress={() =>
                onFormatPress(key as keyof typeof formatOptions)
              }
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
        <Button
          title="test"
          onPress={() => console.log(formatOptions)}
        />
      </ThemedView>
    </ThemedView>
  );
}
