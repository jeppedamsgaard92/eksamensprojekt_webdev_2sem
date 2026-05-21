export const roles = {
  admin: {
    permissions: [
      "create:client-account",
      "create:admin-account",
      "account:send-onboarding-invitation"
    ],
  },

  client: {
    permissions: [],
  },
};