import React, { useState } from 'react';
import { Button, Pressable, TextInput, Platform } from 'react-native';
import { ThemedView } from 'src/components/ThemedView';
import { ThemedText } from '@/src/components/ThemedText';
import styles from 'src/constants/Styling';
import axios from 'axios';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  defaultMealInput,
  defaultDateString,
} from '@/src/constants/utils';

export default function Meals() {
  const localHost =
    'https://f384-2604-3d08-517d-c600-a97a-e426-e0d5-da5c.ngrok-free.app';

  //* Extracted some defaults to utils.ts
  //* DATE
  const [date, setDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(defaultDateString);
  const [showPicker, setShowPicker] = useState(false);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onDatepickerChange = (
    event: DateTimePickerEvent,
    date?: Date
  ): void => {
    if (event.type === 'set' && date) {
      const currentDate = new Date(date);
      setDate(currentDate);

      if (Platform.OS === 'android') {
        toggleDatepicker();
        const modifiedDisplay = currentDate.toLocaleDateString(
          'en-GB',
          {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          }
        );
        setDisplayDate(modifiedDisplay);
      }
    } else {
      toggleDatepicker();
    }
  };
  //* INPUTS
  const [inputs, setInputs] = useState(defaultMealInput);

  const handleMealInputChange = (
    key: keyof typeof inputs,
    input: string
  ) => {
    setInputs((prevInputs) => {
      const newInputs = { ...prevInputs };
      newInputs[key] = {
        ...newInputs[key],
        stringInput: input,
      };
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
  //* SUBMIT BUTTON
  const submitInput = async () => {
    try {
      await axios.post(`${localHost}/tracking/meals`, {
        date,
        displayDate,
        inputs,
      });
      //* RESET STATES
      setInputs({ ...defaultMealInput });
      setDate(new Date());
      setDisplayDate(defaultDateString);
    } catch (e: unknown) {
      console.error('submitInput', e);
    }
  };

  const inputsEmpty = !Object.values(inputs).some(
    (input) => input.stringInput !== ''
  );

  const isSubmitDisabled = inputsEmpty;

  //* FORM
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

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        {showPicker && (
          <Pressable onPress={toggleDatepicker}>
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onDatepickerChange}
              positiveButton={{ textColor: 'white' }}
              negativeButton={{ textColor: 'white' }}
            />
          </Pressable>
        )}
        <Pressable onPress={toggleDatepicker}>
          <TextInput
            id="date"
            style={styles.input}
            value={displayDate}
            textAlign="center"
            editable={false}
          ></TextInput>
        </Pressable>
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
