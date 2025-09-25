import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat con usuario {id}</Text>
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
  text: {
    fontSize: 20,
    fontWeight: "700",
    color: "#252C37",
  },
});
