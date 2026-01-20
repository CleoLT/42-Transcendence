import query from '../queries/friendships.js'

async function getAllFriendships(req, reply) {
    const friendships = await query.getAllFriendships()
    reply.code(200).send(friendships);
}

async function newFriendship(req, reply) {

    let { id1, id2 } = req.body;
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

export default {
    getAllFriendships,
    newFriendship
}