import { Hono } from "hono";
import { type AppEnv } from "../global";
import {
  findOrganizationWorkingUsers,
  getUserWorkingOrganizations,
} from "@publiz/core";
import { useCurrentAppUser } from "../user";
import { useCheckOrganizationUser } from "./middleware";
import {
  findOrganizationRoles,
  findOrganizationMetaSchemas,
} from "@publiz/core";

export const myOrganizationRouter = new Hono<AppEnv>();

myOrganizationRouter.get(
  "/",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const currentUser = c.get("currentAppUser");
    const container = c.get("container");
    const organizations = await getUserWorkingOrganizations(
      container,
      currentUser.id
    );
    return c.json({ data: organizations });
  }
);

myOrganizationRouter.get(
  "/:organization_id/roles",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");
    const organizationRoles = await findOrganizationRoles(container, {
      organizationId: +organizationId,
    });
    return c.json({ data: organizationRoles });
  }
);

myOrganizationRouter.get(
  "/:organization_id/users",
  useCurrentAppUser({ required: true }),
  useCheckOrganizationUser(),
  async (c) => {
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");
    const organizationUsers = await findOrganizationWorkingUsers(
      container,
      +organizationId
    );
    return c.json({ data: organizationUsers });
  }
);

myOrganizationRouter.get(
  "/:organization_id/meta_schemas",
  useCurrentAppUser({ required: true }),
  async (c) => {
    const organizationId = c.req.param("organization_id");
    const container = c.get("container");
    const organizationUsers = await findOrganizationMetaSchemas(container, {
      organizationId: +organizationId,
    });
    return c.json({ data: organizationUsers });
  }
);
