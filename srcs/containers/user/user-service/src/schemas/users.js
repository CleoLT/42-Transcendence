const userResponse = {
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

const errorResponse = {  //duplicado
    type: 'object',
    properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
    }
}

const paramId = {        //duplicado
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
    pattern: '^[a-zA-Z][a-zA-Z0-9_]*$' //empieza x una letra,contiene solo letras num o _
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
    description: 'Create a new user',
    tags: ['Users'],
    summary: 'Create user',

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
    description: 'Get user by id',
    tags: ['Users'],
    summary: 'User info',

    params: paramId,

    response: {
        200: {
            description: 'User info',
            ...userResponse
        },
        404: errorResponse
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
            ...userResponse
        },
        404: errorResponse
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
      minProperties: 1,
      properties: {
        username: username,
        password: password,
        email: email,
        alias: username,
        bio: { type: 'string', minLength: 3, maxLength: 200 }
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
  summary: 'Delete all user info and friendships from database. Replace username by anonymous in  ??????',

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