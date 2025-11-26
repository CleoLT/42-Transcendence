const db = require('./db')
const schemas = require('./schemas')

/*const usersSchema = {
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
}*/


const routes = function(fastify, options, done) {

    fastify.get('/users', { schema: schemas.getAllUsers }, (req, reply) => {
        const users = db.prepare('SELECT * FROM users').all();
        reply.send(users);
    });

    fastify.post('/users', { schema: schemas.postUser }, (req, reply) => {
        const { username, password } = req.body;

        const insert = db.prepare(`
            INSERT INTO users (username, password)
            VALUES (?, ?)
        `);
        const result = insert.run(username, password);
        reply.code(201).send({ id: result.lastInsertRowid, username });
    })

    done(); 
}

module.exports = routes


