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
                information: { type: 'string' },
                avatar: { type: 'string' }
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
        password: { type: 'string', minLength: 6 }
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

module.exports = {
    getAllUsers,
    postUser
}