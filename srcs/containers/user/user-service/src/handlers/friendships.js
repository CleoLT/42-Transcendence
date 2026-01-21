import query from '../queries/friendships.js'
import userQueries from '../queries/users.js'
 
async function getAllFriendships(req, reply) {
    const friendships = await query.getAllFriendships()
    reply.code(200).send(friendships);
}

async function newFriendship(req, reply) {

    let { id1, id2 } = req.body;

    const user1 = await userQueries.userExists(id1)
    const user2 = await userQueries.userExists(id2)

    if (user1 === null || user2 === null) {
        reply.code(404).send({ "statusCode": 404, "error": "Not Found", "message": "User not found" })
        return
    }

    let revert = false

    if (id1 > id2) {
        [id1, id2] = [id2, id1]
        revert = true
    }
    
    const rows = await query.getFriendshipById(id1, id2)
    if (rows !== null) {
        await query.acceptPendingFriendship(id1, id2, revert)
    } else {
        await query.createFriendship(id1, id2, revert)
    }

    const friendship = await query.getFriendshipById(id1, id2)
    reply.code(201).send(friendship)
}

async function addAuthorizationToPlay(req, reply) {
    let { id1, id2 } = req.body;
    let revert = false

    if (id1 > id2) {
        [id1, id2] = [id2, id1]
        revert = true
    }

    const rows = await query.getFriendshipById(id1, id2)
    if (rows === null) {
        reply.code(404).send({ "statusCode": 404, "error": "Not Found", "message": "Friendship not found" })
        return
    }

    const friend = await query.checkIfAreFriends(id1, id2)
    if (friend === null){
        reply.code(403).send({ "statusCode": 403, "error": "Forbidden", "message": "Users are not friends" })
        return
    }

    await query.authorizeToPlay(id1, id2, revert)
    const friendship = await query.getFriendshipById(id1, id2)
    reply.code(201).send(friendship)
}

export default {
    getAllFriendships,
    newFriendship,
    addAuthorizationToPlay
}