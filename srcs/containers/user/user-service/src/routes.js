import userSchema from './schemas/users.js'
import userHandler from './handlers/users.js'
import friendSchema from './schemas/friendships.js'
import friendHandler from './handlers/friendships.js'



const routes = async function(fastify, options) {

    fastify.get('/', { schema: userSchema.getAllUsers }, userHandler.getAllUsers)
    fastify.post('/', { schema: userSchema.postUser }, userHandler.postUser)
    fastify.get('/:userId', { schema: userSchema.getUserById, preHandler: userHandler.verifySessionFromPath }, userHandler.getUserById)
    fastify.post('/user/login', { schema: userSchema.tryLogin }, userHandler.tryLogin)
    fastify.post('/user/logout', { schema: userSchema.logOut }, userHandler.logOut)
    fastify.patch('/:userId', { schema: userSchema.updateUserById, preHandler: userHandler.verifySessionFromPath }, userHandler.updateUserById)
    fastify.delete('/:userId', { schema: userSchema.deleteUserById, preHandler: userHandler.verifySessionFromPath }, userHandler.deleteUserById)
    fastify.post('/:userId/avatar/upload', { schema: userSchema.uploadAvatar/*, preHandler: userHandler.verifySessionFromPath*/ },  userHandler.uploadAvatar)
    //fastify.post('/:userId/avatar/select', { schema: userSchema.selectAvatar },  userHandler.selectAvatar)
    fastify.delete('/:userId/avatar', { schema: userSchema.deleteAvatar },  userHandler.deleteAvatar)


    fastify.get('/friendships', { schema: friendSchema.getAllFriendships, preHandler: userHandler.verifySession }, friendHandler.getAllFriendships) // borrar?
    fastify.get('/:userId/friendships', { schema: friendSchema.getAllFriendsByUserId, preHandler: userHandler.verifySessionFromPath }, friendHandler.getAllFriendsByUserId)
    fastify.get('/:userId/friendships/pending', { schema: friendSchema.getPendingFriendships, preHandler: userHandler.verifySessionFromPath }, friendHandler.getPendingFriendships)
    fastify.get('/:userId/friendships/requests', { schema: friendSchema.getReceivedFriendRequests, preHandler: userHandler.verifySessionFromPath }, friendHandler.getReceivedFriendRequests)
    fastify.post('/friendships', { schema: friendSchema.newFriendship, preHandler: userHandler.verifySessionFromBody }, friendHandler.newFriendship)
    fastify.patch('/friendships/accept', { schema: friendSchema.acceptFriendship, preHandler: userHandler.verifySessionFromBody }, friendHandler.acceptFriendship)
    fastify.patch('/friendships/cancel', { schema: friendSchema.cancelFriendship, preHandler: userHandler.verifySessionFromBody }, friendHandler.cancelFriendship)
    fastify.patch('/friendships/authorization', { schema: friendSchema.addAuthorizationToPlay, preHandler: userHandler.verifySessionFromBody }, friendHandler.addAuthorizationToPlay)
    fastify.patch('/friendships/authorization/cancel', { schema: friendSchema.cancelAuthorization, preHandler: userHandler.verifySessionFromBody }, friendHandler.cancelAuthorization)
}

export default routes
