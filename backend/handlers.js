const db = require('./db')
const query = require('./queries')

function getAllUsers(req, reply) {
    const users = query.getAllUsers()
    reply.send(users);
}

function postUser(req, reply) {
    const { username, password, email} = req.body;

    const result = query.addUser(username, password, email)

    reply.code(201).send({ id: result.lastInsertRowid, username });
}    




module.exports = { getAllUsers, postUser }