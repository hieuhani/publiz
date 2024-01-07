import type { DefaultFirebaseAuthInjectedVariables } from "@fiboup/hono-firebase-auth";
import { DiVariables } from "../di";
import { User } from "@publiz/core";

type Variables = DiVariables &
  DefaultFirebaseAuthInjectedVariables & {
    currentAppUser: User;
  };

type Bindings = {
  FIREBASE_PROJECT_ID: string;
  FIREBASE_WEB_API_KEY: string;
};

export type AppEnv = { Variables: Variables; Bindings: Bindings };
export type CurrentUser = NonNullable<
  DefaultFirebaseAuthInjectedVariables["currentUser"]
>;
