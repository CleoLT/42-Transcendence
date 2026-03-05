const userResponse = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        email: { type: 'string' },
        bio: { type: 'string' },
        avatar: { type: 'string' },
        online_status: { type: 'boolean' },
        created_at: { type: 'string' }
    }
}

const errorResponse = {
    type: 'object',
    properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
    }
}

const paramId = {
    type: 'object',
      properties: {
        userId: { type: 'number' }
      },
    required: ['userId']
}

const username = {
    type: 'string',
    minLength: 2,
    maxLength: 20,
    pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$' //empieza x una letra,contiene solo letras num o _
}

const password = {
    type: 'string',
    minLength: 6,
    maxLength: 20,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$'
    //por lo menos una minuscula, una mayuscula, un decimal, un char especial
  }

const email = {
    type: 'string',
    format: 'email',
    maxLength: 255
}

const avatarImages = [
    "/avatars/bird_04.jpg",
    "/avatars/cat.png",
    "/avatars/butterfly.png",
    "/avatars/dragonfly.png",
    "/avatars/jellyfish_00.png",
    "/avatars/carp_koi_01.png",
    "/avatars/moonfish.png",
    "/avatars/sushi.png",
    "/avatars/swan.png"
]

/*-----------------------SCHEMAS--------------------*/

const getAllUsers = {
    description: 'Get all users',
        tags: ['Users'],
        summary: 'User list. This is a tool for developpment',
        response: {
            200: {
                description: 'Users list',
                type: 'array',
                items: userResponse
            }
        }
}

const postUser = {
    description: 'Internal function: creates new user',
    tags: ['Users'],
    summary: 'Internal function: creates new user',

    body: {
      type: 'object',
      required: ['username', 'password', 'email'],
      properties: {
        username: username,
        password: password,
        email: email
      },
      additionalProperties: false
    },

    response: {
      201: {
        description: 'User created',
        ...userResponse
      },
      400: errorResponse,
      409: errorResponse
    }
}

const getUserById = {
    description: 'Get user by id, requires an active session',
    tags: ['Users'],
    summary: 'User info',

    params: paramId,

    response: {
        200: {
            description: 'User info',
            ...userResponse
        },
        401: errorResponse,
        404: errorResponse
    }
}

const getAvatarById = {
    description: 'Get avatar by id, requires an active session',
    tags: ['Users'],
    summary: 'User avatar info',

    params: paramId,

    response: {
        201: {
            description: 'User Avatar',
            type: 'object',
            properties: {
                id: { type: 'number' },
                avatar: { type: 'string' }
            }
        },
        401: errorResponse,
        404: errorResponse
    }
};

const getUserByName = {
    description: 'Get user by username, requires an active session',
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
            ...userResponse
        },
        404: errorResponse
    }
};

const tryLogin = {
  description: 'Validate user credentials only',
  tags: ['Users'],
  summary: 'Backend credentials validation only',

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
              userId: { type: 'number' },
              email: { type: 'string' }
            }
        },
        401: errorResponse,
        404: errorResponse
    }
}

const tryPassword = {
  description: 'Validate password',
  tags: ['Users'],
  summary: 'Password validation',

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
            description: 'Password valid',
            type: 'object',
            properties: {
              valid: { type: 'boolean' },
              userId: { type: 'number' },
              email: { type: 'string' }
            }
        },
        401: errorResponse,
        404: errorResponse
    }
}

const logOut = {
  description: 'Logs user out',
  tags: ['Users'],
  summary: 'User logout',

  body: {
    type: 'object',
    required: ['username'],
    properties: {
      username: { type: 'string' }
    }
  },

  response: {
    200: {
      description: 'OK',
      type: 'object',
      properties: {
        valid: { type: 'boolean' },
        userId: { type: 'number' }
      }
    },
    404: errorResponse
  }
}

const updateUserById = {
    description: 'Partially update user by id, requires an active session for the user ID in the path',
    tags: ['Users'],
    summary: 'Update user info',

    body: {
        type: 'object',
        minProperties: 1,
        properties: {
            username: username,
            password: password,
            email: email,
            avatar: {
              type: "string",
              enum: avatarImages
            },
            bio: { type: 'string', minLength: 3, maxLength:300 }
        },
        additionalProperties: false
      },
      
    params: paramId,

    response: {
        201: {
            description: 'user updated',
            ...userResponse
        },
        400: errorResponse,
        404: errorResponse,
        409: errorResponse
    }
};

const deleteUserById = {
    description: 'Delete user by id',
    tags: ['Users'],
    summary: 'Delete all user info and friendships from database, requires an active session for the user ID in the path',

    params: paramId,

    response: {
        204: { 
            description: 'User deleted',
            type: 'null' 
        },
        404: errorResponse
    }
};

const uploadAvatar = {
  description: 'Upload user avatar by id',
  tags: ['Users'],
  consumes: ['multipart/form-data'], // for swagger only
  summary: 'Upload avatar. Delete old avatar if exists. Requires an active session for the user ID in the path',

  params: paramId,

  response: {
    200: {
      description: 'file uploaded',
      type: 'object',
      properties: {
        id: { type: 'number' },
        avatar: { type: 'string' }
      }
    },
    400: errorResponse
  }
}

const deleteAvatar = {
    description: 'Delete avatar by id',
    tags: ['Users'],
    summary: 'Delete avatar path from database, delete avatar file, requires an active session for the user ID in the path',

    params: paramId,

    response: {
        201: { 
            description: 'delete avatar',
            type: 'object',
            properties: {
                id: { type: 'number' },
                avatar: { type: 'string' }
            }
        },
        404: errorResponse
    }
};

const disconnect = {
  description: 'Sets online_status to 0',
  tags: ['Users'],
  summary: 'Sets online_status to 0 in the backend',
  body: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: { type: 'number' }
    }
  },
};

const connect = {
  description: 'Sets online_status to 1',
  tags: ['Users'],
  summary: 'Sets online_status to 1 in the backend',
  body: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: { type: 'number' }
    }
  },
};

const userMailExists = {
  description: 'Verifies if email already exists',
  tags: ['Users'],
  summary: 'Checks if an email is already registered in the system',
  params: {
      type: "object",
      required: ['userMail'],
      properties: {
          userMail: { type: 'string' }
      }
  },
  response: {
      200: {
          properties: {
              exists: { type: 'boolean' }
          }
      },
      400: errorResponse
  }
}

export default {
    avatarImages,
    getAllUsers,
    postUser,
    getUserById,
    getAvatarById,
    getUserByName,
    tryLogin,
    tryPassword,
    logOut,
    updateUserById,
    deleteUserById,
    uploadAvatar,
    deleteAvatar,
    disconnect,
    connect,
    userMailExists
}