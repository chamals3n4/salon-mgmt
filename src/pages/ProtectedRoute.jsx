import { useEffect, useState } from "react";
import supabase from "@/Config/SupabaseClient";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAUth = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    checkAUth();
  }, []);

  if (loading) return <p>Loading....</p>;
  return user ? children : <Navigate to="/login" />;
}
