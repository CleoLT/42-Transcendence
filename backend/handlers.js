const db = require('./db')
const query = require('./queries')
const fs = require ('node:fs')
const { pipeline } = require('node:stream/promises')
const path = require('node:path')
const services = require('./services')

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

function getUserByUserName(req, reply) {
    const { userName } =  req.params
    const result = query.getUserByUserName(userName)
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

function updateUserById(req, reply) {
    const modifiedData = req.body; //TODO EL OBJETO
    const { userId } = req.params;

    const result = query.updateUserById(userId, modifiedData)

    reply.code(201).send(result);
}   

function deleteUserById(req, reply) {
    const { userId } = req.params
    query.deleteUserById(userId)

    reply.code(204).send()
}

async function uploadAvatar(req, reply) {
    const { userId } = req.params

    const data = await req.file()

  //  const data = req.body.avatar

    if (!data) {
        return reply.code(400).send({ error: "No file uploaded" })
    }

    const uploadDir = path.join('/app', 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}_${data.filename}`
    const filepath = path.join(uploadDir, filename)

    await pipeline(data.file, fs.createWriteStream(filepath))

    const query = query.uploadAvatar(userId, filepath)

    reply.code(200).send({ 
        userId,
        avatar: query.avatar 
    })
}

async function loginUser(req, reply) {
    const { username, password } = req.body;
  
    const user = await services.login(username, password);
  
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
  
    reply.code(200).send({ id: user.id, username: user.username });
}

module.exports = { 
    getAllUsers, 
    postUser, 
    getUserById,
    updateUserById,
    deleteUserById,
    getUserByUserName,
    uploadAvatar,
    loginUser
}