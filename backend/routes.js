const schema = require('./schemas')
const handler = require('./handlers')

const routes = async function(fastify, options) {

    fastify.get('/users', { schema: schema.getAllUsers }, handler.getAllUsers)
    fastify.post('/users', { schema: schema.postUser }, handler.postUser)
    fastify.get('/users/:userId', { schema: schema.getUserById }, handler.getUserById)
    fastify.patch('/users/:userId', { schema: schema.updateUserById }, handler.updateUserById)
    fastify.delete('/users/:userId', { schema: schema.deleteUserById }, handler.deleteUserById)
    fastify.post('/users/:userId/avatar', { schema: schema.uploadAvatar }, handler.uploadAvatar)
}

module.exports = routes


