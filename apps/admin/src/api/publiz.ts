import { authService } from "@/services/auth";
import ky from "ky";

export type BaseResponse<T> = {
  data: T;
};
export type User = {
  id: number;
  authId: string;
  displayName: string;
  avatarUrl?: string;
  coverUrl?: string;
};

export type Organization = {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  verified: boolean;
  ownerId: number;
};

export type TagType = "SYSTEM" | "DEFAULT";
export type Tag = {
  id: number;
  name: string;
  slug: string;
  type: TagType;
  organizationId?: number;
  userId: number;
};
export const publizClient = ky.extend({
  prefixUrl: import.meta.env.VITE_BASE_PUBLIZ_URL,
  retry: {
    statusCodes: [401],
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = authService.idToken;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    beforeRetry: [
      async () => {
        if (authService.refreshToken) {
          const { data } = await refreshToken({
            token: authService.refreshToken,
          });
          authService.saveToken(data);
        }
      },
    ],
  },
});

export const getMyProfile = () =>
  publizClient.get("api/v1/users/my_profile").json<BaseResponse<User>>();

export const getOrganizations = () =>
  publizClient.get("api/v1/organizations").json<BaseResponse<Organization[]>>();

export const getTags = () =>
  publizClient.get("api/v1/tags").json<BaseResponse<Tag[]>>();

export const getOrganizationById = (id: number) =>
  publizClient
    .get(`api/v1/organizations/${id}`)
    .json<BaseResponse<Organization>>();

export type CreateOrganizationInput = {
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  verified: boolean;
  ownerId: number;
};

export const createOrganization = (input: CreateOrganizationInput) => {
  return publizClient
    .post("admin/api/v1/organizations", { json: input })
    .json<BaseResponse<Organization>>();
};

export type CreateTagInput = {
  name: string;
  slug: string;
  type: TagType;
  organizationId?: number;
  userId: number;
};
export const createTag = (input: CreateTagInput) => {
  return publizClient
    .post("admin/api/v1/tags", { json: input })
    .json<BaseResponse<Tag>>();
};

export const updateOrganization = (
  id: number,
  input: CreateOrganizationInput
) => {
  return publizClient
    .put(`admin/api/v1/organizations/${id}`, { json: input })
    .json<BaseResponse<Organization>>();
};

export type DatabaseMigration = {
  name: string;
  timestamp: string;
};

export const getSystemDatabaseMigrations = () =>
  publizClient
    .get(`api/system/database_migrations`)
    .json<BaseResponse<DatabaseMigration[]>>();

export const executeInitialDatabaseMigration = () => {
  return publizClient
    .get(`api/system/database_migrations/initial_database`)
    .json<BaseResponse<object>>();
};

export type SignUpWithEmailInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  idToken: string;
  email?: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
};

export const signUpWithEmail = (input: SignUpWithEmailInput) => {
  return publizClient
    .post("api/v1/auth/sign_up_with_email", { json: input })
    .json<BaseResponse<AuthResponse>>();
};

export type SignInInput = {
  email: string;
  password: string;
};

export const signIn = (input: SignInInput) => {
  return publizClient
    .post("api/v1/auth/sign_in", { json: input })
    .json<BaseResponse<AuthResponse>>();
};

type RefreshTokenInput = {
  token: string;
};

export const refreshToken = (input: RefreshTokenInput) => {
  return publizClient
    .post("api/v1/auth/refresh_token", { json: input })
    .json<BaseResponse<AuthResponse>>();
};
