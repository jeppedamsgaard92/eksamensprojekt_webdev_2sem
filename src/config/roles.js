export const roles = {
  admin: {
    permissions: [
      "create:client-account",
      "create:admin-account",
      "account:send-onboarding-and-invitation",
      "do-admin-stuff"
    ],
  },

  client: {
    permissions: [],
  },
};