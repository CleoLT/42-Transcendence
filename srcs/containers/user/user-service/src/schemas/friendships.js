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

const paramId = {
  type: 'object',
    properties: {
      userId: { type: 'number' }
    },
    required: ['userId']
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

/*-----------------SCHEMAS-------------------*/

const getAllFriendships = {
    description: 'Get all friendships',
    tags: ['Friendships'],
    summary: 'Friendships list',

    response: {
        200: {
            description: 'Friendships list',
            type: 'array',
            items: friendshipResponse
        }
    }
}

const getAllFriendsByUserId = {
    description: 'Get all friendships by user id',
    tags: ['Friendships'],
    summary: 'Friendships list for this user',

    params: paramId,

    response: {
        200: {
            description: 'Friendships list',
            type: 'array',
            items: friendshipResponse
        },
        404: errorResponse
    }
}

const getPendingFriendships = {
    description: 'Get all pending friendships by user id (the other user have to respond)',
    tags: ['Friendships'],
    summary: 'Pending friendships list for this user (the other user have to respond)',

    params: paramId,

    response: {
        200: {
            description: 'Pending friendships list',
            type: 'array',
            items: friendshipResponse
        },
        404: errorResponse
    }
}

const getReceivedFriendRequests = {
    description: 'Get all pending friendships by user id (the user have to respond)',
    tags: ['Friendships'],
    summary: 'Pending friendships list for this user (the user have to respond)',

    params: paramId,

    response: {
        200: {
            description: 'Pending friendships list',
            type: 'array',
            items: friendshipResponse
        },
        404: errorResponse
    }
}

const newFriendship = {
    description: 'Create a new friendship, (borrar: or accept a pending friendship,) always initiate by id1 ---> to id2',
    tags: ['Friendships'],
    summary: 'Create a new friendship',

    body: twoIdBody,

    response: {
      201: {
        description: 'Friendship created',
        ...friendshipResponse
      },
      400: errorResponse,
      404: errorResponse,
      409: errorResponse
    }
}

const acceptFriendship = {
    description: 'Accept a pending friendship, always initiate by id1 ---> to id2',
    tags: ['Friendships'],
    summary: 'Accept a friendship',

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

const cancelFriendship = {
    description: 'Cancel a friendship, always initiate by id1 ---> to id2',
    tags: ['Friendships'],
    summary: 'Cancel friendship',

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

const cancelAuthorization = {
    description: 'Cancel an authorization to play, always initiate by id1 ---> to id2',
    tags: ['Friendships'],
    summary: 'Cancel authorization to play',

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

export default {
    getAllFriendships,
    getAllFriendsByUserId,
    getPendingFriendships,
    getReceivedFriendRequests,
    newFriendship,
    acceptFriendship,
    addAuthorizationToPlay,
    cancelFriendship,
    cancelAuthorization
}

