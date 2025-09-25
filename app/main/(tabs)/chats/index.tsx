import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Users() {
  const [users, setUsers] = useState([
    { id: "1", name: "Usuario 1" },
    { id: "2", name: "Usuario 2" },
  ]);

  const router = useRouter();

  return (
    <View style={styles.container}>
      {users.map((user) => (
        <Pressable
          key={user.id}
          onPress={() =>
            router.push({
              pathname: "/main/chats/chat",
              params: { id: user.id },
            })
          }
          style={styles.button}
        >
          <Text style={styles.text}>{user.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // centra verticalmente
    alignItems: "center", // centra horizontalmente
    backgroundColor: "#fff",
  },
  button: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#F8C61E",
    borderRadius: 10,
    width: 200,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#252C37",
  },
});
