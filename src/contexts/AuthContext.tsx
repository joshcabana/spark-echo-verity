import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface UserTrust {
  id: string;
  user_id: string;
  dob: string | null;
  phone_verified: boolean;
  selfie_verified: boolean;
  safety_pledge_accepted: boolean;
  onboarding_step: number;
  onboarding_complete: boolean;
  preferences: Record<string, any>;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  userTrust: UserTrust | null;
  isLoading: boolean;
  isAdmin: boolean;
  onboardingComplete: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  userTrust: null,
  isLoading: true,
  isAdmin: false,
  onboardingComplete: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [userTrust, setUserTrust] = useState<UserTrust | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          setProfile(profileData);

          const { data: trustData } = await supabase
            .from("user_trust")
            .select("*")
            .eq("user_id", session.user.id)
            .maybeSingle();
          setUserTrust(trustData as UserTrust | null);

          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          setIsAdmin(!!roleData);
        } else {
          setProfile(null);
          setUserTrust(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setUserTrust(null);
    setIsAdmin(false);
  };

  const onboardingComplete = userTrust?.onboarding_complete ?? false;

  return (
    <AuthContext.Provider value={{ session, user, profile, userTrust, isLoading, isAdmin, onboardingComplete, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
