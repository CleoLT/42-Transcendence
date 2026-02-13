import query from '../queries/users.js'
import fs from 'node:fs'
import { unlink, access, constants } from 'fs/promises'
import path from 'node:path'
import { fileTypeFromBuffer } from 'file-type'


function noFileUploadedError(str) {
    const err = new Error(str)
    err.statusCode = 400
    err.name = 'Bad Request'
    throw err
}

function invalidCredentialsError() {
    const err = new Error('Invalid username or password')
    err.statusCode = 401
    err.name = 'Unauthorized'
    throw err
}

function userNotFoundError() {
    const err = new Error('User not found')
    err.statusCode = 404
    err.name = 'Not Found'
    throw err
}

function userConflictError(string) {
    const err = new Error(string)
    err.statusCode = 409
    err.name = 'Conflict'
    throw err
}

async function deleteAvatarFile(userId) {
    try {
        const oldAvatar = await query.getAvatarByUserId(userId)

        if (oldAvatar === null) return

        await access(oldAvatar.avatar, constants.F_OK)
        await unlink(oldAvatar.avatar)
        console.log('unlink avatar')
    } catch (error) {
        console.log("avatar do not exists")
    }
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
    
        await query.updateUserById(user.insertId, { online_status: 1 });
        reply.code(201).send(result);
    } catch (error) {
        reply.send(error)
    }
}

async function tryLogin(req, reply) {
    try {
        const { username, password } = req.body;

        const match = await query.tryLogin(username, password)
        if (!match) invalidCredentialsError()

        const user = await query.getUserByName(username);
        if (!user || !user.id) userNotFoundError()

        if (user.online_status === 1) userConflictError()

        await query.updateUserById(user.id, { online_status: 1 });

        return reply.code(200).send({
            valid: true,
            userId: user.id
        });        
    } catch (error) {
        reply.send(error)
    }
}

async function logOut(req, reply) {
    try {
        const { username } = req.body;
        const user = await query.getUserByName(username);
        if (user === null) userNotFoundError()
        await query.updateUserById(user.id, { online_status: 0 });

        return reply.code(200).send({
            valid: true,
            userId: user.id
        })
    } catch (error) {
        reply.send(error)
    }
}

async function validate(req, reply) {
    return reply.code(200).send({ valid: true });
}

async function updateUserById(req, reply) {
    const modifiedData = req.body;
    const { username, email } = req.body
    const { userId } = req.params;

    try {
        await checkIfUserExists(userId)
        const userByName = await query.getUserByName(username)
        if (userByName && userByName.id != userId) userConflictError('Choose an other username')
        const userByEmail = await query.getUserByEmail(email)
        if (userByEmail && userByEmail.id != userId) userConflictError('User already exists')

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
        await deleteAvatarFile(userId)
        await query.deleteUserById(userId)
        reply.code(204).send('user deleted')
    } catch (error) {
        reply.send(error)
    }
}

async function uploadAvatar(req, reply) {
    try {
        const { userId } = req.params

        await checkIfUserExists(userId)
        await deleteAvatarFile(userId)
        
        const data = await req.file()
        if (!data) noFileUploadedError('No file uploaded')

        const allowedTypes = ['image/jpeg', 'image/png']
        if (!allowedTypes.includes(data.mimetype)) noFileUploadedError('only .jpg and .png images are allowed')

        const buffer = await data.toBuffer()
        const type = await fileTypeFromBuffer(buffer)
        if (!type || !['image/png','image/jpeg'].includes(type.mime)) noFileUploadedError('only .jpg and .png images are allowed')
    
        const uploadDir = path.join('/app', 'uploads', 'avatars');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `${userId}_${data.filename}`
        const filepath = path.join(uploadDir, filename)

        await fs.promises.writeFile(filepath, buffer)

        await query.uploadAvatar(userId, filepath)

        const result = await query.getUserById(userId)
        reply.code(200).send(result)
    } catch(error) {
        reply.send(error)
    }
}

async function getAvatarById(req, reply) {
    try {
        const { userId } = req.params

        await checkIfUserExists(userId)
        const result = await query.getAvatarByUserId(userId)
        reply.code(201).send({ id: userId, ...result });
    } catch (error) {
        reply.send(error)
    }
}

async function deleteAvatar(req, reply) {
    try {
        const { userId } = req.params

        await checkIfUserExists(userId)
        await deleteAvatarFile(userId)
        await query.deleteAvatar(userId)

        const result = await query.getUserById(userId)
        reply.code(201).send(result);
    } catch(error) {
        reply.send(error)
    }
}
  

export default { 
    getAllUsers, 
    checkIfUserExists,
    getUserById,
    postUser, 
    getUserByName,
    tryLogin,
    logOut,
    validate,
    updateUserById,
    deleteUserById,
    uploadAvatar,
    getAvatarById,
    deleteAvatar
}
