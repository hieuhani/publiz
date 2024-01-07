import {
  googleAccountLookUp,
  FirebaseConfigs,
  LookUpPayload,
} from "@fiboup/google-identify-toolkit";

export type IdentityModule = {
  googleAccountLookUp: (
    payload: LookUpPayload
  ) => ReturnType<typeof googleAccountLookUp>;
};

export const getIdentityModule = (config: FirebaseConfigs) => ({
  async googleAccountLookUp(payload: LookUpPayload) {
    return googleAccountLookUp(config, payload);
  },
});
