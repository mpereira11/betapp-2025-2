// app/main/(tabs)/chats/index.tsx
import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type Profile = {
  id: string;
  name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
};

export default function Users() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, username, avatar_url")
        .neq("id", user.id)
        .order("name", { ascending: true });
      setLoading(false);
      if (error) {
        console.error("Error fetching profiles:", error);
        return;
      }
      setUsers(data ?? []);
    };
    fetchProfiles();
  }, [user]);

  // Busca chat entre me y other — si no existe crea uno. Retorna chatId
  const getOrCreateChat = async (otherId: string) => {
    if (!user) throw new Error("Not authenticated");

    // Primera: buscar chat donde (user_id = me and user_id2 = other) OR swapped
    const { data: existingChats, error: selectError } = await supabase
      .from("chats")
      .select("id, user_id, user_id2")
      .or(`and(user_id.eq.${user.id},user_id2.eq.${otherId}),and(user_id.eq.${otherId},user_id2.eq.${user.id})`)
      .limit(1);

    if (selectError) {
      console.error("Error querying chats:", selectError);
      throw selectError;
    }

    if (existingChats && existingChats.length > 0) {
      return existingChats[0].id;
    }

    // No existe: crear uno
    const { data: newChat, error: insertError } = await supabase
      .from("chats")
      .insert([{ user_id: user.id, user_id2: otherId }])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating chat:", insertError);
      throw insertError;
    }
    return newChat.id;
  };

  const handlePressUser = async (otherId: string) => {
    try {
      const chatId = await getOrCreateChat(otherId);
      // Navegar al chat, pasando chatId y otherId como params
      router.push({
        pathname: "/main/chats/chat",
        params: { chatId, otherId },
      } as any); // cast para TS si es necesario
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {users.map((u) => (
        <Pressable
          key={u.id}
          onPress={() => handlePressUser(u.id)}
          style={styles.button}
        >
          <Text style={styles.text}>{u.name ?? u.username ?? "Usuario"}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  button: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#F8C61E",
    borderRadius: 10,
    width: 260,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#252C37",
  },
});
