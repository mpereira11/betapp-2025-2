import { Link, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/images/logo-bet-app.png')}
        style={styles.image}
      />
      <TextInput
        style={styles.input}
        placeholder="Email..."
      />
      <TextInput
        style={styles.input}
        placeholder="Password..."
        secureTextEntry
      />

      <View style={styles.inputContainer}>
        <Link href="/(auth)/reset" asChild>
          <Text style={styles.forgot_text}>Forgot Password?</Text>
        </Link>
      </View>

      <TouchableOpacity 
        style={styles.button} onPress={() => router.push('/main/(tabs)/home')}>
        <Text
          style={styles.text_button}>
          Login
        </Text>
      </TouchableOpacity>

      <Text
        style={styles.media_text}
      >
        Or by social media
      </Text>
      <View style={styles.icon_row}>
        <Image source={require('../../assets/images/facebook-icon.png')} style={styles.icon} />
        <Image source={require('../../assets/images/google-icon.png')} style={styles.icon} />
        <Image source={require('../../assets/images/X-icon.png')} style={styles.icon} />
      </View>

      <Text style={styles.signup_text}>
        Don't have an account?{' '}
        <Link href="/(auth)/register" asChild>
          <Text style={{ color: '#F8C61E', textDecorationLine: 'underline' }}>Sign up</Text>
        </Link>
      </Text>

    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: 250,
    alignItems: 'flex-end',
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#F8C61E',
    marginBottom: 20,
  },
  icon_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252C37'
  },
  text: {
    color: '#F8C61E',
    fontSize: 24
  },
  input: {
    height: 50,
    width: 250,
    borderColor: '#F8C61E',
    backgroundColor: '#3A3F47',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#ffffffff',
  },
  forgot_text: {
    color: '#d7d7d7ff',
    fontSize: 10,
    marginTop: 3,
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
  },
  media_text: {
    color: '#d7d7d7ff',
    fontSize: 10,
    marginTop: 40,
  },
  button: {
  backgroundColor: '#F8C61E',
  borderRadius: 25,
  paddingVertical: 18,
  paddingHorizontal: 32,
  marginTop: 40,
  shadowColor: '#FdD700',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.5,
  shadowRadius: 5,
  },
  image: {
    width: 144,
    height: 144,
    marginBottom: 25
  },
  text_button: {
    color: '#252C37',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  signup_text: {
    color: '#d7d7d7ff',
    fontSize: 10,
    marginTop: 50,
  }
});
