import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BetsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoutIcon}
        onPress={() => router.push("/login")}
      >
        <Entypo name="log-out" size={25} color="#F8C61E" />
      </TouchableOpacity>
      <Text style={styles.text}>Bets Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIcon: {
    position: "absolute",
    top: 60,
    right: 25,
    zIndex: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#252C37",
  },
});
