import query from '../queries/friendships.js'
import userQueries from '../queries/users.js'
 
async function getAllFriendships(req, reply) {
    const friendships = await query.getAllFriendships()
    reply.code(200).send(friendships);
}

async function getAllFriendsByUserId(req, reply) {
    const { userId } =  req.params

    const user = await userQueries.userExists(userId)
    if (user === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "User not found" })

    const result = await query.getFriendsByUserId(userId)
    reply.code(200).send(result) 
}

async function getPendingFriendships(req, reply) {
    const { userId } =  req.params

    const user = await userQueries.userExists(userId)
    if (user === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "User not found" })

    const result = await query.getPendingFriendships(userId)
    reply.code(200).send(result) 
}

async function getReceivedFriendRequests(req, reply) {
    const { userId } =  req.params

    const user = await userQueries.userExists(userId)
    if (user === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "User not found" })
    
    const result = await query.getReceivedFriendRequests(userId)
    reply.code(200).send(result) 
}

async function newFriendship(req, reply) {

    let { id1, id2 } = req.body;

    if (id1 === id2)
        return reply
            .code(400)
            .send({ "statusCode": 400, "error": "Bad Request", "message": "cannot use the same id" })

    const user1 = await userQueries.userExists(id1)
    const user2 = await userQueries.userExists(id2)

    if (user1 === null || user2 === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "User not found" })

    let revert = false

    if (id1 > id2) {
        [id1, id2] = [id2, id1]
        revert = true
    }
    
    const rows = await query.getFriendshipById(id1, id2)
    if (rows !== null)
        return reply
            .code(409)
            .send({ "statusCode": 409, "error": "Conflict", "message": "Friendship already exists" })

    await query.createFriendship(id1, id2, revert)
    const friendship = await query.getFriendshipById(id1, id2)
    reply.code(201).send(friendship)
}

async function acceptFriendship(req, reply) {

    let { id1, id2 } = req.body;

    if (id1 === id2) 
        return reply.code(400).send({ "statusCode": 400, "error": "Bad Request", "message": "cannot use the same id" })
        
    const user1 = await userQueries.userExists(id1)
    const user2 = await userQueries.userExists(id2)

    if (user1 === null || user2 === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "User not found" })
    
    let revert = false

    if (id1 > id2) {
        [id1, id2] = [id2, id1]
        revert = true
    }
    
    const rows = await query.getFriendshipById(id1, id2)
    if (rows === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "Friendship not found" })

    await query.acceptPendingFriendship(id1, id2, revert)
    const friendship = await query.getFriendshipById(id1, id2)
    reply.code(201).send(friendship)
}

async function addAuthorizationToPlay(req, reply) {
    let { id1, id2 } = req.body;

    if (id1 === id2) 
        return reply
            .code(400)
            .send({ "statusCode": 400, "error": "Bad Request", "message": "cannot use the same id" })
        
    let revert = false

    if (id1 > id2) {
        [id1, id2] = [id2, id1]
        revert = true
    }

    const rows = await query.getFriendshipById(id1, id2)
    if (rows === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "Friendship not found" })

    const friend = await query.checkIfAreFriends(id1, id2)
    if (friend === null)
        return reply
            .code(403)
            .send({ "statusCode": 403, "error": "Forbidden", "message": "Users are not friends" })

    await query.authorizeToPlay(id1, id2, revert)
    const friendship = await query.getFriendshipById(id1, id2)
    reply.code(201).send(friendship)
}

async function cancelFriendship(req, reply) {
    let { id1, id2 } = req.body;

    if (id1 === id2)
        return reply
            .code(400)
            .send({ "statusCode": 400, "error": "Bad Request", "message": "cannot use the same id" })

    let revert = false

    if (id1 > id2) {
        [id1, id2] = [id2, id1]
        revert = true
    }

    const rows = await query.getFriendshipById(id1, id2)
    if (rows === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "Friendship not found" })

    await query.cancelFriendship(id1, id2, revert)
    const friendship = await query.getFriendshipById(id1, id2)
    reply.code(201).send(friendship)
}

async function cancelAuthorization(req, reply) {
    let { id1, id2 } = req.body;

    if (id1 === id2)
        return reply
            .code(400)
            .send({ "statusCode": 400, "error": "Bad Request", "message": "cannot use the same id" })

    let revert = false

    if (id1 > id2) {
        [id1, id2] = [id2, id1]
        revert = true
    }

    const rows = await query.getFriendshipById(id1, id2)
    if (rows === null)
        return reply
            .code(404)
            .send({ "statusCode": 404, "error": "Not Found", "message": "Friendship not found" })

    const friend = await query.checkIfAreFriends(id1, id2)
    if (friend === null)
        return reply
            .code(403)
            .send({ "statusCode": 403, "error": "Forbidden", "message": "Users are not friends" })

    await query.cancelAuthorization(id1, id2, revert)
    const friendship = await query.getFriendshipById(id1, id2)
    reply.code(201).send(friendship)
}

export default {
    getAllFriendships,
    getAllFriendsByUserId,
    getPendingFriendships,
    getReceivedFriendRequests,
    newFriendship,
    acceptFriendship,
    addAuthorizationToPlay,
    cancelFriendship,
    cancelAuthorization
}