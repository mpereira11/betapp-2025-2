import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs, useRouter } from "expo-router";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F8C61E",
        tabBarStyle: { backgroundColor: "#252C37" },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="home" color="#F8C61E" />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="chat" color="#F8C61E" />
          ),
        }}
      />
      <Tabs.Screen
        name="bets"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={28}
              name="trophy-outline"
              color="#F8C61E"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="credit-card" color="#F8C61E" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color="#F8C61E" />
          ),
        }}
      />
    </Tabs>
  );
}
