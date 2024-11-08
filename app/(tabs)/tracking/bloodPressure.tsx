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
    sys: [0, 0, 0],
    dia: [0, 0, 0],
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

  //TODO Extract TextInput to reduce repetition
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView>
          <ThemedText>Systolic</ThemedText>
          <TextInput
            id="sys0"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('sys', 0, input)
            }
            placeholder="Entry 1"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
          <TextInput
            id="sys1"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('sys', 1, input)
            }
            placeholder="Entry 2"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
          <TextInput
            id="sys2"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('sys', 2, input)
            }
            placeholder="Entry 3"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
        </ThemedView>
        <ThemedView>
          <ThemedText>Diastolic</ThemedText>
          <TextInput
            id="dia0"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('dia', 0, input)
            }
            placeholder="Entry 1"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
          <TextInput
            id="dia1"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('dia', 1, input)
            }
            placeholder="Entry 2"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
          <TextInput
            id="dia2"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('dia', 2, input)
            }
            placeholder="Entry 3"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
        </ThemedView>
        <ThemedView>
          <ThemedText>Pulse</ThemedText>
          <TextInput
            id="pulse0"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('pulse', 0, input)
            }
            placeholder="Entry 1"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
          <TextInput
            id="pulse1"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('pulse', 1, input)
            }
            placeholder="Entry 2"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
          <TextInput
            id="pulse2"
            style={styles.input}
            onChangeText={(input) =>
              handleInputChange('pulse', 2, input)
            }
            placeholder="Entry 3"
            placeholderTextColor="#000000"
            keyboardType="numeric"
          ></TextInput>
        </ThemedView>
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
