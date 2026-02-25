import jwt from 'jsonwebtoken';
import secretutils from '../db.js';

async function verifySession(request, reply) {
    const token = request.cookies?.access_token;

    if (!token) {
        console.log('[verifySession] Token not received');
        return reply.code(401).send({ message: 'No active session' });
    }

    try {
        request.user = jwt.verify(token, secretutils.readSecret(process.env.JWT_SECRET_FILE));
        request.headers['x-user-id'] = request.user.userId;
        request.headers['x-user-role'] = request.user.role;
    } catch (err) {
        console.log('[verifySession] JWT error:', err.message);
        return reply.code(401).send({ message: 'No active session' });
    }
}

async function verifySessionFromPath(request, reply) {
    const token = request.cookies?.access_token;

    if (!token) {
        console.log('[verifySessionFromPath] Token not received');
        return reply.code(401).send({ message: 'No active session' });
    }

    try {
        request.user = jwt.verify(token, secretutils.readSecret(process.env.JWT_SECRET_FILE));
        request.headers['x-user-id'] = request.user.userId;
        request.headers['x-user-role'] = request.user.role;

        const { userId } = request.params; // de la url /:userId/etc

        if (Number(userId) !== Number(request.user.userId))
        {
            return reply.code(403).send({
                message: 'Unauthorized for this resource',
                debug: { routeUserId: userId, sessionUserId: request.user.userId }
            });
        }

    } catch (err) {
        console.log('[verifySessionFromPath] JWT error:', err.message);
        return reply.code(401).send({ message: 'No active session' });
    }
}


async function verifySessionFromBody(request, reply) {
    const token = request.cookies?.access_token;

    if (!token) {
        console.log('[verifySessionFromBody] Token not received');
        return reply.code(401).send({ message: 'No active session' });
    }

    try {
        request.user = jwt.verify(token, secretutils.readSecret(process.env.JWT_SECRET_FILE));
        request.headers['x-user-id'] = request.user.userId;
        request.headers['x-user-role'] = request.user.role;

        const { id1 } = request.body;

        if (Number(id1) !== Number(request.user.userId))
            return reply.code(403).send({ message: 'Unauthorized for this friendship' });

    } catch (err) {
        console.log('[verifySessionFromBody] JWT error:', err.message);
        return reply.code(401).send({ message: 'No active session' });
    }
}

  

export default { 
    verifySession,
    verifySessionFromPath,
    verifySessionFromBody
}