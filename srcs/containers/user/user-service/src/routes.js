import userSchema from './schemas/users.js'
import userHandler from './handlers/users.js'
import friendSchema from './schemas/friendships.js'
import friendHandler from './handlers/friendships.js'
import preHandler from './handlers/prehandlers.js'


const routes = async function(fastify, options) {

    fastify.get('/', { schema: userSchema.getAllUsers }, userHandler.getAllUsers)
    fastify.post('/', { schema: userSchema.postUser }, userHandler.postUser)
    fastify.get('/:userId', { schema: userSchema.getUserById }, userHandler.getUserById)
    fastify.post('/user/login', { schema: userSchema.tryLogin }, userHandler.tryLogin)
    fastify.post('/user/logout', { schema: userSchema.logOut }, userHandler.logOut)

    fastify.patch('/:userId', { schema: userSchema.updateUserById, preHandler: preHandler.verifySessionFromPath }, userHandler.updateUserById)
    fastify.delete('/:userId', { schema: userSchema.deleteUserById, preHandler: preHandler.verifySessionFromPath }, userHandler.deleteUserById)
    fastify.post('/:userId/avatar/upload', { schema: userSchema.uploadAvatar, preHandler: preHandler.verifySessionFromPath }, userHandler.uploadAvatar)
    fastify.get('/:userId/avatar', { schema: userSchema.getAvatarById }, userHandler.getAvatarById) ////BORRAR ESTO NO SIRVE 
    fastify.delete('/:userId/avatar', { schema: userSchema.deleteAvatar },  userHandler.deleteAvatar)

    fastify.get('/friendships', { schema: friendSchema.getAllFriendships}, friendHandler.getAllFriendships) // borrar? solo para tests
    fastify.get('/:userId/friendships', { schema: friendSchema.getAllFriendsByUserId, preHandler: preHandler.verifySessionFromPath }, friendHandler.getAllFriendsByUserId)
    fastify.get('/:userId/friendships/pending', { schema: friendSchema.getPendingFriendships, preHandler: preHandler.verifySessionFromPath }, friendHandler.getPendingFriendships)
    fastify.get('/:userId/friendships/requests', { schema: friendSchema.getReceivedFriendRequests, preHandler: preHandler.verifySessionFromPath }, friendHandler.getReceivedFriendRequests)
    fastify.post('/friendships', { schema: friendSchema.newFriendship, preHandler: preHandler.verifySessionFromBody }, friendHandler.newFriendship)
    fastify.patch('/friendships/accept', { schema: friendSchema.acceptFriendship, preHandler: preHandler.verifySessionFromBody }, friendHandler.acceptFriendship)
    fastify.delete('/friendships/cancel', { schema: friendSchema.cancelFriendship, preHandler: preHandler.verifySessionFromBody }, friendHandler.cancelFriendship)
    //fastify.patch('/friendships/authorization', { schema: friendSchema.addAuthorizationToPlay, preHandler: preHandler.verifySessionFromBody }, friendHandler.addAuthorizationToPlay)
    //fastify.patch('/friendships/authorization/cancel', { schema: friendSchema.cancelAuthorization, preHandler: preHandler.verifySessionFromBody }, friendHandler.cancelAuthorization)
}

export default routes
