import query from '../queries/friendships.js'

async function getAllFriendships(req, reply) {
    const friendships = await query.getAllFriendships()
    reply.send(friendships);
}

async function newFriendship(req, reply) {

    const { id1, id2 } = req.body;

    //check friendship, if exists update friendship
        //return etc

    //else
    const result = await query.addFriendship(id1, id2)
    reply.code(201).send({ id: result.insertId });

}    

export default {
    getAllFriendships,
    newFriendship
}