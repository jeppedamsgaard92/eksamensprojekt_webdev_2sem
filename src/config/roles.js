export const roles = {
  admin: {
    permissions: [
      "account:create-client",
      "account:create-admin",
    ],
  },

  client: {
    permissions: [],
  },
};