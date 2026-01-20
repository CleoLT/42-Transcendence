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
    description: 'Create a new friendship, or accept a pending friendship',
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

export default {
    getAllFriendships,
    newFriendship
}