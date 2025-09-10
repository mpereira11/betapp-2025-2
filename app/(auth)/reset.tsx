import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ResetScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
              source={require('../../assets/images/logo-bet-app.png')}
              style={styles.image}
            />

      <Text style={styles.title}>Reset Password</Text>

      <TextInput placeholder="Email" style={styles.input} />

      <TouchableOpacity 
        style={styles.button} onPress={() => {}}>
        <Text
          style={styles.text_button}>
          Send Reset Link
        </Text>
      </TouchableOpacity>

      <View style={styles.icon_row}>
        <Image source={require('../../assets/images/facebook-icon.png')} style={styles.icon} />
        <Image source={require('../../assets/images/google-icon.png')} style={styles.icon} />
        <Image source={require('../../assets/images/X-icon.png')} style={styles.icon} />
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#252C37'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffffff',
  },
  image: {
    width: 144,
    height: 144,
    marginBottom: 25
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
  text_button: {
    color: '#252C37',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  backButton: {
    marginTop: 16,
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#F8C61E',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
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
    marginTop: 50,
    gap: 20,
  }
});