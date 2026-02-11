import jwt from 'jsonwebtoken';

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
    verifySession,
    verifySessionFromPath,
    verifySessionFromBody
}