import query from '../queries/users.js'
import fs from 'node:fs'
import util from 'node:util'
import { pipeline } from 'node:stream'
import path from 'node:path'
import jwt from 'jsonwebtoken';

const pump = util.promisify(pipeline)

async function getAllUsers(req, reply) {
    const users = await query.getAllUsers()
    reply.send(users);
}

async function postUser(req, reply) {
    const { username, password, email } = req.body;

    const result = await query.addUser(username, password, email)

    reply.code(201).send({ id: result.insertId, username });
}    

async function getUserById(req, reply) {
    const { userId } =  req.params
    const result = await query.getUserById(userId)
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

async function getUserByName(req, reply) {
    const { username } = req.params
    const result = await query.getUserByName(username)
  
    reply.code(200).send({
      id: result.id,
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

async function tryLogin(req, reply) {
    const { username, password } = req.body;
    const match = await query.tryLogin(username, password)

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

async function logOut(req, reply) {
    const { username } = req.body;
    const user = await query.getUserByName(username);
    await query.updateUserById(user.id, { online_status: 0 });

    return reply.code(200).send({
        valid: true,
        userId: user.id
    });
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


async function verifySession(request, reply) {
    const token = request.cookies?.access_token;

    if (!token) {
        console.log('[verifySession] No se recibió token');
        return reply.code(401).send({ message: 'No hay una sesión iniciada' });
    }

    try {
        request.user = jwt.verify(token, process.env.JWT_SECRET);
        request.headers['x-user-id'] = request.user.userId;
        request.headers['x-user-role'] = request.user.role;
    } catch (err) {
        console.log('[verifySession] JWT error:', err.message);
        return reply.code(401).send({ message: 'No hay una sesión iniciada' });
    }
}

async function verifySessionFromPath(request, reply) {
    const token = request.cookies?.access_token;

    if (!token) {
        console.log('[verifySessionFromPath] No se recibió token');
        return reply.code(401).send({ message: 'No hay una sesión iniciada' });
    }

    try {
        request.user = jwt.verify(token, process.env.JWT_SECRET);
        request.headers['x-user-id'] = request.user.userId;
        request.headers['x-user-role'] = request.user.role;

        const { userId } = request.params; // de la url /:userId/etc

        if (Number(userId) !== Number(request.user.userId))
        {
            return reply.code(403).send({
                message: 'No autorizado para acceder a este recurso',
                debug: { routeUserId: userId, sessionUserId: request.user.userId }
            });
        }

    } catch (err) {
        console.log('[verifySessionFromPath] JWT error:', err.message);
        return reply.code(401).send({ message: 'No hay una sesión iniciada' });
    }
}


async function verifySessionFromBody(request, reply) {
    const token = request.cookies?.access_token;

    if (!token) {
        console.log('[verifySessionFromBody] No se recibió token');
        return reply.code(401).send({ message: 'No hay una sesión iniciada' });
    }

    try {
        request.user = jwt.verify(token, process.env.JWT_SECRET);
        request.headers['x-user-id'] = request.user.userId;
        request.headers['x-user-role'] = request.user.role;

        const { id1 } = request.body;

        if (Number(id1) !== Number(request.user.userId))
            return reply.code(403).send({ message: 'No autorizado para aceptar esta friendship' });

    } catch (err) {
        console.log('[verifySessionFromBody] JWT error:', err.message);
        return reply.code(401).send({ message: 'No hay una sesión iniciada' });
    }
}

  

export default { 
    getAllUsers, 
    postUser, 
    getUserById,
    getUserByName,
    tryLogin,
    logOut,
    updateUserById,
    deleteUserById,
    uploadAvatar,
    verifySession,
    verifySessionFromPath,
    verifySessionFromBody
}
