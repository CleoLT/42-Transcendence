const errorResponse = {
    type: 'object',
    properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
    }
}

const friendshipResponse = {
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

const twoIdBody = {
      type: 'object',
      required: ['id1', 'id2'],
      additionalProperties: false,
      properties: {
        id1: { type: 'number' },
        id2: { type: 'number' }
      }
}

const getAllFriendships = {
    description: 'Get all friendships',
    tags: ['Friendships'],
    summary: 'Friendships list',

    response: {
        200: {
            description: 'Friendships list',
            ...friendshipResponse
        }
    }
}

const newFriendship = {
    description: 'Create a new friendship, or accept a pending friendship, always initiate by id1 ---> to id2',
    tags: ['Friendships'],
    summary: 'Create friendship',

    body: twoIdBody,

    response: {
      201: {
        description: 'Friendship actualized',
        ...friendshipResponse
      },
      400: errorResponse,
      404: errorResponse
    }
}

const addAuthorizationToPlay = {
    description: 'Authorize a friend to play, always initiate by id2 ----> to id2',
    tags: ['Friendships'],
    summary: 'Authorize a friend to play',

    body: twoIdBody,

    response: {
      201: {
        description: 'Friendship actualized',
        ...friendshipResponse
      },
      400: errorResponse,
      403: errorResponse,
      404: errorResponse
    }
}

export default {
    getAllFriendships,
    newFriendship,
    addAuthorizationToPlay
}

