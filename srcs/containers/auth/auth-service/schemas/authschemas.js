// schemas.js

const statusSchema = {
    description: 'Check service status',
    tags: ['Auth'],
    summary: 'Health check',
    response: {
      200: {
        description: 'Service running',
        type: 'object',
        properties: {
          service: { type: 'string' },
          status: { type: 'string' }
        },
        required: ['service', 'status']
      }
    }
  };
  
  const loginSchema = {
    description: 'User login',
    tags: ['Auth'],
    summary: 'Authenticate user credentials',
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      }
    },
    response: {
      200: { type: 'object' },
      400: { type: 'object' },
      403: { type: 'object' },
      500: { type: 'object' }
    }
  };
  
  const login2FASchema = {
    description: 'Validate 2FA code',
    tags: ['Auth'],
    summary: 'Login with two-factor authentication',
    body: {
      type: 'object',
      required: ['username', 'code'],
      properties: {
        username: { type: 'string' },
        code: { type: 'string' }
      }
    },
    response: {
      200: {
        description: '2FA successful',
        type: 'object',
        properties: { message: { type: 'string' } }
      },
      400: { type: 'object' },
      401: { type: 'object' },
      500: { type: 'object' }
    }
  };
  
  const logoutSchema = {
    description: 'Logout user',
    tags: ['Auth'],
    summary: 'Invalidate session',
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' }
      }
    },
    response: {
      200: { type: 'object' },
      401: { type: 'object' },
      500: { type: 'object' }
    }
  };
  
  const registerSchema = {
    description: 'Register user (send 2FA code)',
    tags: ['Auth'],
    summary: 'Register new user with 2FA',
    body: {
      type: 'object',
      required: ['username', 'password', 'email'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' }
      }
    },
    response: {
      201: {
        description: '2FA code sent',
        type: 'object',
        properties: { email: { type: 'string' } }
      },
      400: { type: 'object' },
      500: { type: 'object' }
    }
  };
  
  const register2FASchema = {
    description: 'Validate registration 2FA',
    tags: ['Auth'],
    summary: 'Complete registration using 2FA code',
    body: {
      type: 'object',
      required: ['username', 'code'],
      properties: {
        username: { type: 'string' },
        code: { type: 'string' }
      }
    },
    response: {
      200: {
        description: '2FA registration successful',
        type: 'object',
        properties: { message: { type: 'string' } }
      },
      400: { type: 'object' },
      401: { type: 'object' },
      500: { type: 'object' }
    }
  };
  
  const validateSchema = {
    description: 'Validate session token',
    tags: ['Auth'],
    summary: 'Check if user session is valid',
    body: {
      type: 'object',
      properties: { lastUserId: { type: 'number' } }
    },
    response: {
      200: {
        description: 'Session valid',
        type: 'object',
        properties: {
          valid: { type: 'boolean' },
          userId: { type: 'number' },
          username: { type: 'string' }
        }
      },
      401: {
        description: 'Session invalid',
        type: 'object',
        properties: {
          valid: { type: 'boolean' },
          message: { type: 'string' }
        }
      }
    }
  };
  
  const updateUsernameSchema = {
    description: 'Update username',
    tags: ['Auth'],
    summary: 'Change username and refresh token',
    params: {
      type: 'object',
      required: ['username'],
      properties: { username: { type: 'string' } }
    },
    response: {
      200: {
        description: 'Username updated',
        type: 'object',
        properties: { message: { type: 'string' } }
      },
      400: { type: 'object' },
      401: { type: 'object' }
    }
  };

  export default {
    statusSchema,
    loginSchema,
    login2FASchema,
    logoutSchema,
    registerSchema,
    register2FASchema,
    validateSchema,
    updateUsernameSchema
  }