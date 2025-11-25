const db = require('./db')

const usersSchema = {
    description: 'Obtener todos los usuarios',
        tags: ['Users'], // agrupa rutas en Swagger
        summary: 'Lista de usuarios',
        response: {
        200: {
            description: 'Lista de usuarios',
            type: 'array',
            items: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                username: { type: 'string' },
                email: { type: 'string' },
                information: { type: 'string' },
                avatar: { type: 'string' }
            }
            }
        }
        }
}


const routes = function(fastify, options, done) {

    fastify.get('/users', { schema: usersSchema }, 
        (req, reply) => {
        const users = db.prepare('SELECT * FROM users').all();
        reply.send(users);
    });
    done(); 
}

module.exports = routes
/*fastify.get('/users', {
  schema: {
    description: 'Obtener todos los usuarios',
    tags: ['Users'], // agrupa rutas en Swagger
    summary: 'Lista de usuarios',
    response: {
      200: {
        description: 'Lista de usuarios',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            information: { type: 'string' },
            avatar: { type: 'string' }
          }
        }
      }
    }
  }
}, (req, reply) => {
  const users = db.prepare('SELECT * FROM users').all();
  reply.send(users);
});*/

