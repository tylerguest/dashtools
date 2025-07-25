import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  return user;
}