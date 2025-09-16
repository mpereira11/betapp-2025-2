import { supabase } from "@/utils/supabase";
import { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mantener sesión activa al abrir la app
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  // 🔹 Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (error) throw new Error(error.message);
    setUser(data.user);
  };

  // 🔹 Registro
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setIsLoading(false);

    if (error) throw new Error(error.message);
    setUser(data.user);

    // Si quieres guardar el perfil en tu tabla personalizada "profiles"
    // await supabase.from("profiles").insert({ id: data.user.id, email });
  };

  // 🔹 Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
