import query from '../queries/users.js'
import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'
import path from 'node:path'

const pump = util.promisify(pipeline)

function userNotFoundError() {
    const err = new Error('User not found')
    err.statusCode = 404
    err.name = 'Not Found'
    throw err
}

function userConflictError() {
    const err = new Error('User already exists')
    err.statusCode = 409
    err.name = 'Conflict'
    throw err
}

/*----------------HANDLERS-------------------------*/

async function getAllUsers(req, reply) {
    const users = await query.getAllUsers()
    reply.send(users);
}

async function checkIfUserExists(userId) {
    const user = await query.getUserById(userId)

    if (user === null) userNotFoundError()
    return user
}

async function getUserById(req, reply) {
    const { userId } =  req.params

    try {
        const user = await checkIfUserExists(userId)
        reply.code(200).send(user) 
    } catch (error) {
        reply.send(error)
    }
}

async function getUserByName(req, reply) {
    const { username } = req.params

    try {
        const result = await query.getUserByName(username)
        if (user === null) userNotFoundError()
        reply.code(200).send(result)
    } catch (error) {
        reply.send(error)
    }
}

async function postUser(req, reply) {
    const { username, password, email } = req.body;

    try {
        const name = await query.getUserByName(username)
        if (name !== null) userConflictError()
        const mail = await query.getUserByEmail(email)
        if (mail !== null) userConflictError()
        const user = await query.addUser(username, password, email)
        const result = await query.getUserById(user.insertId) 
    
        reply.code(201).send(result);
    } catch (error) {
        reply.send(error)
    }
}

async function getCredentialsCoincidence(req, reply) {
    const { username, password } = req.body;
    const match = await query.getCredentialsCoincidence(username, password)

    if (!match)
        return reply.code(401).send({ error: 'Usuario o contraseña incorrecta' });

    const user = await query.getUserByName(username);
    if (!user || !user.id) return reply.code(500).send({ error: 'User data invalid' });

    if (user.online_status === 1)
        return reply.code(401).send({ error: 'Usuario ya en linea' });

    await query.updateUserById(user.id, { online_status: 1 });

    return reply.code(200).send({
        valid: true,
        userId: user.id
    });
}

async function updateUserById(req, reply) {
    const modifiedData = req.body
    const { username, email } = req.body
    const { userId } = req.params;

    try {
        const user = await checkIfUserExists(userId)
        if (user.username === username) userConflictError()
        if (user.email === email) userConflictError()

        await query.updateUserById(userId, modifiedData)
        const result = await query.getUserById(userId)
        reply.code(201).send(result);
    } catch (error) {
        reply.send(error)
    }
}   

async function deleteUserById(req, reply) {
    const { userId } = req.params
    
    try {
        await checkIfUserExists(userId)
        
        //poner anonymous los partidos en la database de games de este user ????
        await query.deleteUserById(userId)
        reply.code(204).send('user deleted')
    } catch (error) {
        reply.send(error)
    }
}

async function uploadAvatar(req, reply) {
    const userId = req.params

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

  //  await pipeline(data.file, fs.createWriteStream(filepath))
    await pump(data.file, fs.createWriteStream(filepath))


    const query = uploadAvatar(userId, filepath)

    reply.code(200).send({ 
        userId,
        avatar: query.avatar 
    })
}

export default { 
    getAllUsers, 
    checkIfUserExists,
    getUserById,
    postUser, 
    getUserByName,
    getCredentialsCoincidence,
    updateUserById,
    deleteUserById,
    uploadAvatar
}