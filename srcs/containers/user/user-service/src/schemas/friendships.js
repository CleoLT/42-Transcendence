const getAllFriendships = {
    description: 'Get all friendships',
        tags: ['Friendships'], // agrupa rutas en Swagger
        summary: 'Friendships list',
        response: {
        200: {
            description: 'Friendships list',
            type: 'array',
            items: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                user1_id: { type: 'number' },
                user2_id: { type: 'number' },
                user1_accept: { type: 'boolean' }, 
                user2_accept: { type: 'boolean' }, 
                user1_authorization: { type: 'boolean' },
                user2_authorization: { type: 'boolean' }
            }
            }
        }
    }
}

const newFriendship = {
    description: 'Create a new friendship, or accept a pending friendship, always initiate by id1 ---> to id2',
    tags: ['Friendships'],
    summary: 'Create friendship',

    body: {
      type: 'object',
      properties: {
        id1: { type: 'number' },
        id2: { type: 'number' }
      }
    },

    response: {
      201: {
        description: 'Friendship actualized',
        type: 'object',
        properties: {
          id: { type: 'number' },
          user1_id: { type: 'number' },
          user2_id: { type: 'number' },
          user1_accept: { type: 'number' },
          user2_accept: { type: 'number' },
          user1_authorization: { type: 'number' },
          user2_authorization: { type: 'number' }
        }
      }
    }
}

const addAuthorizationToPlay = {
    description: 'Authorize a friend to play, always initiate by id2 ----> to id2',
    tags: ['Friendships'],
    summary: 'Authorize a friend to play',

    body: {
      type: 'object',
      properties: {
        id1: { type: 'number' },
        id2: { type: 'number' }
      }
    },

    response: {
      201: {
        description: 'Friendship actualized',
        type: 'object',
        properties: {
          id: { type: 'number' },
          user1_id: { type: 'number' },
          user2_id: { type: 'number' },
          user1_accept: { type: 'number' },
          user2_accept: { type: 'number' },
          user1_authorization: { type: 'number' },
          user2_authorization: { type: 'number' }
        }
      },
      404: {
        descripton: 'Frienship does not exist',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    }
}

export default {
    getAllFriendships,
    newFriendship,
    addAuthorizationToPlay
}