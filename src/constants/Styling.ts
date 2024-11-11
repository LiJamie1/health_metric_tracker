import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    justifyContent: 'center',
    alignContent: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#faf7f5',
    color: '#000000',
  },
  sideBySideInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  sideBySideInputs: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    backgroundColor: '#faf7f5',
    color: '#000000',
  },
});

export default styles;
