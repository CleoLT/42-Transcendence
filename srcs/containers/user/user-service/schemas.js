const getAllUsers = {
    description: 'Get all users',
        tags: ['Users'], // agrupa rutas en Swagger
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

const postUser = {
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

const getUserById = {
  description: 'Get user by id',
  tags: ['Users'],
  summary: 'User info',

  // 👇 Validación del parámetro de la ruta
  params: {
    type: 'object',
    properties: {
      userId: { type: 'number' }
    },
    required: ['userId']
  },

  // 👇 Validación de la respuesta
  response: {
    200: {
      description: 'user info',
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
};

const getUserByName = {
  description: 'Get user by username',
  tags: ['Users'],
  summary: 'User info by username',

  params: {
    type: 'object',
    properties: {
      username: { type: 'string' }
    },
    required: ['username']
  },

  response: {
    200: {
      description: 'user info',
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
};

const getCredentialsCoincidence = {
  description: 'Validate user credentials',
  tags: ['Users'],
  summary: 'Credentials validation',

  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  },

  response: {
    200: {
      description: 'Credentials valid',
      type: 'object',
      properties: {
        valid: { type: 'boolean' },
        userId: { type: 'number' }
      }
    },
    401: {
      description: 'Invalid credentials',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};


const updateUserById = {
  description: 'Partially update user by id',
  tags: ['Users'],
  summary: 'update user info',

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
    
  params: {
    type: 'object',
    properties: {
      userId: { type: 'number' }
    },
    required: ['userId']
  },

  response: {
    200: {
      description: 'user updated',
      type: 'object',
      properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        email: { type: 'string' },
        alias: { type: 'string' },
        bio: { type: 'string' },
        avatar: { type: 'string' }, //?
        online_status: { type: 'boolean' }, //?
        created_at: { type: 'string' }, //?
        playing_time: { type: 'number' } //?
      }
    }
  }
};

const deleteUserById = {
  description: 'Delete user by id',
  tags: ['Users'],
  summary: 'Delete user info',

  params: {
    type: 'object',
    properties: {
      userId: { type: 'number' }
    },
    required: ['userId']
  },
};

const uploadAvatar = {
  description: 'Upload user avatar by id',
  tags: ['Users'],
 // consumes: ['multipart/form-data'], // for swagger only
  summary: 'upload avatar',

  params: {
    type: 'object',
    properties: {
      userId: { type: 'number' }
    },
    required: ['userId']
  },

 /*body: {
    type: "object",
    required: ["avatar"],
    properties: {
      avatar: { type: 'object'
      //  type: 'string',
      //  format: 'binary'
      }
    }
  },*/

  response: {
    200: {
      description: 'upload info',
      type: 'object',
      properties: {
        id: { type: 'number' },
        avatar: { type: 'string' },
      }
    }
  }
};


export default {
    getAllUsers,
    postUser,
    getUserById,
    getUserByName,
    getCredentialsCoincidence,
    updateUserById,
    deleteUserById,
    uploadAvatar
}
