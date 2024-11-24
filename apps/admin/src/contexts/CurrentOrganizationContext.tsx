import { Organization } from "@/api";
import { createContext, useContext } from "react";

export type OrganizationContextState = {
  organization: Organization | null;
  isSystem: boolean;
};

export const CurrentOrganizationContext =
  createContext<OrganizationContextState>({
    organization: null,
    isSystem: false,
  });

export const CurrentOrganizationContextProvider =
  CurrentOrganizationContext.Provider;

export const useCurrentOrganization = () => {
  const context = useContext(CurrentOrganizationContext);

  if (!context) {
    throw new Error(
      "useCurrentOrganization must be used within a CurrentOrganizationContextProvider"
    );
  }

  return context;
};
