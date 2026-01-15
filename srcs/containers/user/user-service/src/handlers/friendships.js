import query from '../queries/friendships.js'

/*async function getAllUsers(req, reply) {
    const users = await query.getAllUsers()
    reply.send(users);
}*/

async function newFriendship(req, reply) {

    const { id1, id2 } = req.body;

    const result = await query.addUser(username, password, email)

    reply.code(201).send({ id: result.insertId, user1_id, user2_id });
}    

export default {
    newFriendship
}