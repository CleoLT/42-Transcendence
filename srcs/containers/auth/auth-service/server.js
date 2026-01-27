import Fastify from 'fastify';
import bcrypt from 'bcrypt';

const fastify = Fastify({ logger: true });

fastify.get('/', async () => {
  return { service: 'auth', status: 'running' };
});

fastify.post('/login', async (req, reply) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) return reply.code(400).send({ error: 'Credenciales invalidas' });

    const coincidence = await fetch('http://user-service:3000/user',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    let resValues = await coincidence.json();
    
    //const userId = resValues.userId;
    //* JWT y sesion de usuario *//
    //const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //reply
    //  .setCookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
    //  .send({ username: user.username });

    return reply.code(coincidence.status).send(resValues); // propaga error custom desde user-service

  } catch (err) {
    return reply.code(500).send({ error: 'Internal auth error' });
  }
});

fastify.listen({ port: 3000, host: '0.0.0.0' });