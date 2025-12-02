const schemas = require('./schemas')
const handlers = require('./handlers')

const routes = async function(fastify, options) {

    fastify.get('/users', { schema: schemas.getAllUsers }, handlers.getAllUsers)
    fastify.post('/users', { schema: schemas.postUser }, handlers.postUser)

}

module.exports = routes


