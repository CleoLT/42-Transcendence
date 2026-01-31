import userSchema from './schemas/users.js'
import userHandler from './handlers/users.js'
import friendSchema from './schemas/friendships.js'
import friendHandler from './handlers/friendships.js'



const routes = async function(fastify, options) {

    fastify.get('/', { schema: userSchema.getAllUsers }, userHandler.getAllUsers)
    fastify.post('/', { schema: userSchema.postUser }, userHandler.postUser)
    fastify.get('/:userId', { schema: userSchema.getUserById }, userHandler.getUserById)
    fastify.post('/user/login', { schema: userSchema.tryLogin }, userHandler.tryLogin)
    fastify.post('/user/logout', { schema: userSchema.logOut }, userHandler.logOut)
    fastify.patch('/:userId', { schema: userSchema.updateUserById }, userHandler.updateUserById)
    fastify.delete('/:userId', { schema: userSchema.deleteUserById }, userHandler.deleteUserById)
    fastify.post('/:userId/avatar', { schema: userSchema.uploadAvatar }, userHandler.uploadAvatar)

    fastify.get('/friendships', { schema: friendSchema.getAllFriendships}, friendHandler.getAllFriendships)
    fastify.get('/:userId/friendships', { schema: friendSchema.getAllFriendsByUserId }, friendHandler.getAllFriendsByUserId) // sin body; auth: verificar userId parametro
    fastify.get('/:userId/friendships/pending', { schema: friendSchema.getPendingFriendships }, friendHandler.getPendingFriendships) // sin body; auth: verificar userId parametro
    fastify.get('/:userId/friendships/requests', { schema: friendSchema.getReceivedFriendRequests }, friendHandler.getReceivedFriendRequests) // sin body; auth: verificar userId parametro
    fastify.post('/friendships', { schema: friendSchema.newFriendship }, friendHandler.newFriendship) // recibe body con dos ids; auth: verificar user1 logeado
    fastify.patch('/friendships/accept', { schema: friendSchema.acceptFriendship }, friendHandler.acceptFriendship) // recibe body con dos ids; auth: verificar user1 logeado
    fastify.patch('/friendships/cancel', { schema: friendSchema.cancelFriendship }, friendHandler.cancelFriendship) // recibe body con dos ids; auth: verificar user1 logeado
    fastify.patch('/friendships/authorization', { schema: friendSchema.addAuthorizationToPlay }, friendHandler.addAuthorizationToPlay) // recibe body con dos ids; auth: verificar user1 logeado
    fastify.patch('/friendships/authorization/cancel', { schema: friendSchema.cancelAuthorization }, friendHandler.cancelAuthorization) // recibe body con dos ids; auth: verificar user1 logeado
}

export default routes
