import Fastify from 'fastify';
import auth from './auth.js';
import jwt from 'jsonwebtoken';
import fycookie from '@fastify/cookie';

const fastify = Fastify({ logger: true });

fastify.register(fycookie);

fastify.get('/', async () => {
  return { service: 'auth', status: 'running' };
});

fastify.post('/login', async (req, reply) => {
  try {
    const { username, password } = req.body || {};

    if (auth.checkActiveSession(req))
      return reply.code(403).send({ error: 'Ya hay una sesion activa' });

    if (!username || !password) return reply.code(400).send({ error: 'Credenciales invalidas' });

    const coincidence = await fetch('http://user-service:3000/user/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const resValues = await coincidence.json();

    if (coincidence.ok)
    {
      const token = jwt.sign({ userId: resValues.userId, username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      reply.setCookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
    }

    return reply.code(coincidence.status).send(resValues); // 200 OK, o propaga error desde user-service

  } catch (err) {
    req.log.error(err, ''); // debug
    return reply.code(500).send({ error: 'Internal auth error' });
  }
});

fastify.post('/logout', async (req, reply) => {

  if (auth.isLogged(req))
  {
    const { username } = req.body || {};
    if (!username) return reply.code(200).send({ message: 'Logout unnecessary' });

    const logoutRes = await fetch('http://user-service:3000/user/logout',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const resValues = await logoutRes.json();
    if (logoutRes.ok)
    {
      reply.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
    }
    return reply.code(logoutRes.status).send(resValues);
  }

});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', service: 'auth-service' };
});

// Check to avoid leaving sockets open with nodemon
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

//fastify.listen({ port: 3000, host: '0.0.0.0' });