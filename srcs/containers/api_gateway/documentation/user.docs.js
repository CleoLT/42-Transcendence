
module.exports = [

  // =========================
  // GET /api/users
  // =========================
  {
    method: 'GET',
    url: '/api/users',
    schema: {
      description: 'Get all users',
      tags: ['Users'],
      summary: 'User list',
      response: {
        200: {
          description: 'Users list',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              username: { type: 'string' },
              email: { type: 'string' },
              alias: { type: 'string' },
              bio: { type: 'string' },
              avatar: { type: 'string' },
              online_status: { type: 'boolean' },
              created_at: { type: 'string' }
            }
          }
        }
      }
    }
  },

  // =========================
  // POST /api/users
  // =========================
  {
    method: 'POST',
    url: '/api/users',
    schema: {
      description: 'Create a new user',
      tags: ['Users'],
      summary: 'Create user',
      body: {
        type: 'object',
        required: ['username', 'password', 'email'],
        properties: {
          username: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
          email: { type: 'string', minLength: 6 }
        },
        additionalProperties: false
      },
      response: {
        201: {
          description: 'User created',
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' }
          }
        }
      }
    }
  },

  // =========================
  // GET /api/users/:userId
  // =========================
  {
    method: 'GET',
    url: '/api/users/:userId',
    schema: {
      description: 'Get user by id',
      tags: ['Users'],
      summary: 'User info',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' }
        },
        required: ['userId']
      },
      response: {
        200: {
          description: 'User info',
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            alias: { type: 'string' },
            bio: { type: 'string' },
            avatar: { type: 'string' },
            online_status: { type: 'boolean' },
            created_at: { type: 'string' },
            playing_time: { type: 'number' }
          }
        }
      }
    }
  },

  // =========================
  // PATCH /api/users/:userId
  // =========================
  {
    method: 'PATCH',
    url: '/api/users/:userId',
    schema: {
      description: 'Partially update user by id',
      tags: ['Users'],
      summary: 'Update user info',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' }
        },
        required: ['userId']
      },
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
          email: { type: 'string', minLength: 6 },
          alias: { type: 'string', minLength: 3 },
          bio: { type: 'string', minLength: 3, maxLength: 200 }
        },
        additionalProperties: false
      },
      response: {
        200: {
          description: 'User updated',
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            alias: { type: 'string' },
            bio: { type: 'string' },
            avatar: { type: 'string' },
            online_status: { type: 'boolean' },
            created_at: { type: 'string' },
            playing_time: { type: 'number' }
          }
        }
      }
    }
  },

  // =========================
  // DELETE /api/users/:userId
  // =========================
  {
    method: 'DELETE',
    url: '/api/users/:userId',
    schema: {
      description: 'Delete user by id',
      tags: ['Users'],
      summary: 'Delete user',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' }
        },
        required: ['userId']
      }
    }
  },

  // =========================
  // POST /api/users/:userId/avatar
  // =========================
  {
    method: 'POST',
    url: '/api/users/:userId/avatar',
    schema: {
      description: 'Upload user avatar by id',
      tags: ['Users'],
      summary: 'Upload avatar',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' }
        },
        required: ['userId']
      },
      response: {
        200: {
          description: 'Avatar uploaded',
          type: 'object',
          properties: {
            id: { type: 'number' },
            avatar: { type: 'string' }
          }
        }
      }
    }
  }

]
