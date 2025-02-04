import { AuthResponse, signIn, signUpAdminUser, signUpWithEmail } from "@/api";
import Cookies from "js-cookie";

export const authService = {
  signUpWithEmail: async (email: string, password: string) => {
    const { data } = await signUpWithEmail({ email, password });
    authService.saveToken(data);
  },
  signUpAdminUser: async (email: string, password: string) => {
    const { data } = await signUpAdminUser({ email, password });
    console.log({ data });
    authService.saveToken(data);
  },
  signIn: async (email: string, password: string) => {
    const { data } = await signIn({ email, password });
    authService.saveToken(data);
  },
  saveToken: (payload: AuthResponse) => {
    const expires = new Date(Date.now() + +payload.expiresIn * 1000);
    Cookies.set("idToken", payload.idToken, {
      expires,
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
