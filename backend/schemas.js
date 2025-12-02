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
      required: ['username', 'password'],
      properties: {
        username: { type: 'string', minLength: 3 },
        password: { type: 'string', minLength: 6 },
        email: { type: 'string', minLength: 6 }
      }
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
      }//,
      //required: ['id', 'username']
    }
  }
};


module.exports = {
    getAllUsers,
    postUser,
    getUserById
}

