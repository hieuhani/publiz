import { getMyProfile, User } from "@/api";
import { authService } from "@/services/auth";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

export interface AuthContextState {
  checkAuth: () => Promise<User | null>;
  signOut: () => void;
}

export const initialState: AuthContextState = {
  checkAuth: async () => {
    throw new Error("checkAuth is not implemented");
  },
  signOut: () => {
    throw new Error("signOut is not implemented");
  },
};

const AuthContext = createContext<AuthContextState>(initialState);

export const AuthProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const checkAuth = useCallback(async () => {
    if (!authService.idToken && !authService.refreshToken) {
      return null;
    }

    if (!authService.refreshToken) {
      return null;
    }

    try {
      const myProfileResponse = await getMyProfile();

      return myProfileResponse.data;
    } catch {
      return null;
    }
  }, []);

  const signOut = useCallback(() => {
    authService.signOut();
    window.location.reload();
  }, []);

  return (
    <AuthContext.Provider value={{ checkAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
