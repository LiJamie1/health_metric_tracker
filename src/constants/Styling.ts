import { StatusBar, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#222222',
  },
  container: {
    flex: 1,
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
    // color: '#000000',
  },
});

export default styles;
