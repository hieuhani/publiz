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
  rolesMask?: number;
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
export type TaxonomyType = "SYSTEM" | "DEFAULT";

export type Taxonomy = {
  id: number;
  name: string;
  slug: string;
  type: TaxonomyType;
  organizationId?: number;
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

export const getTags = (tenant = "-") => {
  if (tenant === "-") {
    return publizClient.get("api/v1/tags").json<BaseResponse<Tag[]>>();
  }

  return publizClient
    .get(`api/v1/my_organizations/${tenant}/tags`)
    .json<BaseResponse<Tag[]>>();
};

export const getTaxonomies = (tenant = "-") => {
  if (tenant === "-") {
    return publizClient
      .get("api/v1/taxonomies")
      .json<BaseResponse<Taxonomy[]>>();
  }

  return publizClient
    .get(`api/v1/organizations/${tenant}/taxonomies`)
    .json<BaseResponse<Taxonomy[]>>();
};

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
    .post("api/admin/v1/organizations", { json: input })
    .json<BaseResponse<Organization>>();
};

export type CreateTagInput = {
  name: string;
  slug: string;
  type: TagType;
  organizationId?: number;
  userId: number;
};

export const createTag = (input: CreateTagInput, tenant = "-") => {
  if (tenant === "-") {
    return publizClient
      .post("api/admin/v1/tags", { json: [input] })
      .json<BaseResponse<Tag>>();
  }

  return publizClient
    .post(`api/v1/my_organizations/${tenant}/tags`, { json: input })
    .json<BaseResponse<Tag>>();
};

export const updateTag = (id: number, input: CreateTagInput, tenant = "-") => {
  if (tenant === "-") {
    return publizClient
      .put(`api/admin/v1/tags/${id}`, { json: input })
      .json<BaseResponse<Tag>>();
  }

  return publizClient
    .put(`api/v1/my_organizations/${tenant}/tags/${id}`, { json: input })
    .json<BaseResponse<Tag>>();
};

export type CreateTaxonomyInput = {
  name: string;
  slug: string;
};

export const createTaxonomy = (input: CreateTaxonomyInput, tenant = "-") => {
  if (tenant === "-") {
    return publizClient
      .post("api/admin/v1/taxonomies", { json: input })
      .json<BaseResponse<Taxonomy>>();
  }
  return publizClient
    .post(`api/v1/my_organizations/${tenant}/taxonomies`, { json: input })
    .json<BaseResponse<Taxonomy>>();
};

export const updateTaxonomy = (
  id: number,
  input: CreateTaxonomyInput,
  tenant = "-"
) => {
  if (tenant === "-") {
    return publizClient
      .put(`api/admin/v1/taxonomies/${id}`, { json: input })
      .json<BaseResponse<Taxonomy>>();
  }
  return publizClient
    .put(`api/v1/my_organizations/${tenant}/taxonomies/${id}`, { json: input })
    .json<BaseResponse<Taxonomy>>();
};

export const updateOrganization = (
  id: number,
  input: CreateOrganizationInput
) => {
  return publizClient
    .put(`api/admin/v1/organizations/${id}`, { json: input })
    .json<BaseResponse<Organization>>();
};

export const getMyOrganizations = () => {
  return publizClient
    .get(`api/v1/my_organizations`)
    .json<BaseResponse<Organization[]>>();
};

export const getMyOrganization = (organizationId: number | string) => {
  return publizClient
    .get(`api/v1/my_organizations/${organizationId}`)
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

export const signUpAdminUser = (input: SignUpWithEmailInput) => {
  return publizClient
    .post("api/system/sign_up_admin_user", { json: input })
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
