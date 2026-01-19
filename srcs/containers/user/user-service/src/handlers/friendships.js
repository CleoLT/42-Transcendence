import query from '../queries/friendships.js'

async function getAllFriendships(req, reply) {
    const friendships = await query.getAllFriendships()
    reply.send(friendships);
}

async function newFriendship(req, reply) {

    let { id1, id2 } = req.body;
    let revert = false

    if (id1 > id2) {
        [id1, id2] = [id2, id1]
        revert = true
    }
    
    const rows = await query.checkIfFrienshipExists(id1, id2)
    if (rows.length > 0) {
        const result = await query.acceptPendingFriendship(id1, id2, revert)
        reply.code(201).send({ id: result.insertId });
    } else {
        const result = await query.createFriendship(id1, id2, revert)
        reply.code(201).send({ id: result.insertId });
    }
}    

export default {
    getAllFriendships,
    newFriendship
}