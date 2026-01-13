
export default [ {
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "User list",
        description: "Get all users"
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        description: "Create a new user"
      }
    },

    "/api/users/{userId}": {
      get: {
        tags: ["Users"],
        summary: "User info",
        description: "Get user by id"
      },
      patch: {
        tags: ["Users"],
        summary: "Update user info",
        description: "Partially update user by id"
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user",
        description: "Delete user by id"
      }
    },

    "/api/users/{userId}/avatar": {
      post: {
        tags: ["Users"],
        summary: "Upload avatar",
        description: "Upload user avatar by id"
      }
    }
  }
}
]