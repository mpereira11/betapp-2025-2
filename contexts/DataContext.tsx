import { supabase } from "@/utils/supabase";
import { createContext, useEffect } from "react";



interface DataContextProps {

}

export const DataContext = createContext({});

// MessageContext
// ChatContext
// BetsContext

export const DataProvider = ({ children }: any) => {
  
  // Variables


  // Functions

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await supabase.from("profiles").select("*");

      console.log({response})
    }
    catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <DataContext.Provider value={{}}>
      {children}
    </DataContext.Provider>
  );
};