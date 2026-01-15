const newFriendship = {
    description: 'Create a new friendship, or accept a pending friendship',
    tags: ['Friendships'],
    summary: 'Create friendship',

    body: {
      type: 'object',
      required: ['id1', 'id2'],
      properties: {
        id1: { type: 'number' },
        id2: { type: 'number' }
      },
      additionalProperties: false
    },

    response: {
      201: {
        description: 'Friendship actualized',
        type: 'object',
        properties: {
          id: { type: 'number' },
          user1_id: { type: 'number' },
          user2_id: { type: 'number' }
        }
      }
    }
}

export default {
    newFriendship
}