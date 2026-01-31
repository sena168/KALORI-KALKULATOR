import { useState, useEffect, useCallback } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/integrations/firebase/client";

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const ALLOWED_EMAILS = new Set([
  "fransiscaroberta@gmail.com",
  "ashmeeishwar@gmail.com",
  "suhuac3ng@gmail.com",
  "senaprasena@gmail.com",
  "smpsantoyusupjalanjawa@gmail.com",
]);

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email && !ALLOWED_EMAILS.has(currentUser.email)) {
        await signOut(auth);
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      const email = auth.currentUser?.email || "";
      if (!ALLOWED_EMAILS.has(email)) {
        await signOut(auth);
        return { error: new Error("only-admin") };
      }
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error: error as Error };
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  return {
    user,
    loading,
    signInWithGoogle,
    signOut: signOutUser,
  };
};
