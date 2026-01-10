const schema = require('./schemas')
const handler = require('./handlers')

const routes = async function(fastify, options) {

    fastify.get('/', { schema: schema.getAllUsers }, handler.getAllUsers)
    fastify.post('/', { schema: schema.postUser }, handler.postUser)
    fastify.get('/:userId', { schema: schema.getUserById }, handler.getUserById)
    fastify.patch('/:userId', { schema: schema.updateUserById }, handler.updateUserById)
    fastify.delete('/:userId', { schema: schema.deleteUserById }, handler.deleteUserById)
    fastify.post('/:userId/avatar', { schema: schema.uploadAvatar }, handler.uploadAvatar)
}

module.exports = routes
