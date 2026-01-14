import Fastify from 'fastify';
import bcrypt from 'bcrypt';

const fastify = Fastify({ logger: true });

fastify.get('/', async () => {
  return { service: 'auth', status: 'running' };
});

fastify.post('/login', async (req, reply) => {
  const { username, password } = req.body;

  const res = await fetch(`http://user-service:3000/user/${username}`);
  const user = await res.json();

  if (!user || !user.username) return reply.code(401).send({ error: 'Usuario no encontrado' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return reply.code(401).send({ error: 'Contraseña incorrecta' });
  else
    return { message: 'Bienvenido ' + user.username };

  //* JWT y sesion de usuario *//
  //const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  //reply
  //  .setCookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
  //  .send({ username: user.username });
});

fastify.listen({ port: 3000, host: '0.0.0.0' });
