import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  return (
    <View
      style={styles.container}
    >
      <Image
        source={require('../assets/images/logo-bet-app.png')}
        style={styles.image}
      />
      <TextInput
        style={styles.input}
        placeholder="Email..."
      />
      <TextInput
        style={styles.input}
        placeholder="Password..."
      />

      <Text
        style={styles.forgot}
      >
        Forgot Password?
      </Text>

      <TouchableOpacity 
        style={styles.button} onPress={() => {}}>
      <Text
      style={{color: '#252C37', fontWeight: 'bold', fontSize: 16}}>
        Login
      </Text>
      </TouchableOpacity>
    

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252C37',
  },
  text: {
    color: '#F8C61E',
    fontSize: 24
  },
  input: {
    height: 40,
    width: 220,
    borderColor: '#F8C61E',
    backgroundColor: '#3A3F47',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#ffffffff',
  },
  forgot: {
    color: '#d7d7d7ff',
    fontSize: 10,
    marginTop: 3,
    alignSelf: 'flex-end',
    marginRight: 95,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#F8C61E',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20
  }
});

// Image
// TextInput
// Button -> Touch