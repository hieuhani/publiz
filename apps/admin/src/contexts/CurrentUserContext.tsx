import { User } from "@/api";
import { createContext, useContext } from "react";

export type CurrentUserContextState = User | null;

const CurrentUserContext = createContext<CurrentUserContextState>(null);

export const CurrentUserContextProvider = CurrentUserContext.Provider;

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error(
      "useCurrentUser must be used within a CurrentUserContextProvider"
    );
  }
  return context;
};
