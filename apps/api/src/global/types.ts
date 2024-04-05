import type { DefaultFirebaseAuthInjectedVariables } from "@fiboup/hono-firebase-auth";
import { DiVariables } from "../di";
import { User } from "@publiz/core";

type Variables = DiVariables &
  DefaultFirebaseAuthInjectedVariables & {
    currentAppUser: User;
  };

type Env = {
  DB_HOST?: string;
  DB_PORT?: number;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_DATABASE?: string;
  DB_SSL?: boolean;
  DB_SSL_REJECT_UNAUTHORIZED?: string;
  DB_PREPARE?: string;
  FIREBASE_API_KEY: string;
  FIREBASE_PROJECT_ID: string;
  ADMIN_AUTH_IDS?: string;
  S3_BUCKET: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_REGION?: string;
  S3_ENDPOINT?: string;
  S3_GET_GCS_IMAGE_SERVING_ENDPOINT?: string;
  CORS_ORIGIN?: string;
  CORS_ALLOW_HEADERS?: string;
  CORS_ALLOW_METHODS?: string;
  CORS_MAX_AGE?: string;
  CORS_CREDENTIALS?: string;
};

type Bindings = {
  HYPERDRIVE?: Hyperdrive;
} & Env;

export type AppEnv = { Variables: Variables; Bindings: Bindings };
export type CurrentUser = NonNullable<
  DefaultFirebaseAuthInjectedVariables["currentUser"]
>;
