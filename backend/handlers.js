const db = require('./db')
const query = require('./queries')

function getAllUsers(req, reply) {
    const users = query.getAllUsers()
    reply.send(users);
}

function postUser(req, reply) {
    const { username, password, email } = req.body;

    const result = query.addUser(username, password, email)

    reply.code(201).send({ id: result.lastInsertRowid, username });
}    

function getUserById(req, reply) {
    const { userId } =  req.params
    const result = query.getUserById(userId)
    reply.code(200).send({
        userId, 
        username: result.username,
        email: result.email,
        alias: result.alias,
        bio: result.bio,
        avatar: result.avatar,
        online_status: result.online_status,
        created_at: result.created_at,
        playing_time: result.playing_time
    }) 
}



module.exports = { getAllUsers, postUser, getUserById }