import { getMyProfile } from "@/api";
import { authService } from "@/services/auth";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";

export interface AuthContextState {
  checkAuth: () => Promise<boolean>;
}

export const initialState: AuthContextState = {
  checkAuth: async () => {
    throw new Error("checkAuth is not implemented");
  },
};

const AuthContext = createContext<AuthContextState>(initialState);

export const AuthProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const checkAuth = useCallback(async () => {
    if (!authService.idToken && !authService.refreshToken) {
      return false;
    }

    if (!authService.refreshToken) {
      return false;
    }

    try {
      await getMyProfile();
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ checkAuth }}>
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
