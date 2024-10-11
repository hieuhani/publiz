import { AuthResponse, signIn, signUpWithEmail } from "@/api";
import Cookies from "js-cookie";

export const authService = {
  signUpWithEmail: async (email: string, password: string) => {
    const { data } = await signUpWithEmail({ email, password });
    authService.saveToken(data);
  },
  signIn: async (email: string, password: string) => {
    const { data } = await signIn({ email, password });
    authService.saveToken(data);
  },
  saveToken: (payload: AuthResponse) => {
    Cookies.set("idToken", payload.idToken, {
      expires: +payload.expiresIn,
    });
    Cookies.set("refreshToken", payload.refreshToken);
  },
  signOut: () => {
    Cookies.remove("idToken");
    Cookies.remove("refreshToken");
  },
  get idToken() {
    return Cookies.get("idToken");
  },
  get refreshToken() {
    return Cookies.get("refreshToken");
  },
};
