import Fastify from 'fastify';
import auth from './auth.js';
import jwt from 'jsonwebtoken';
import cookie from '@fastify/cookie';
import nodemailer from 'nodemailer';

const fastify = Fastify({ logger: true });

fastify.register(cookie);

// 2FA en memoria
const pending2FA = new Map();

// Mail transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.mailersend.net',
  port: 587,            // o 2525
  secure: false,        // TLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

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

      const code2FA = Math.floor(100000 + Math.random() * 900000).toString();
      pending2FA.set(username, { code: code2FA, userId: resValues.userId, expires: Date.now() + 5*60*1000 });

      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: resValues.email,
        subject: 'Código 2FA',
        text: `Tu código de verificación es: ${code2FA}`
      });

      // ** Movido a 2FA ** //
      //const token = jwt.sign({ userId: resValues.userId, username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      //reply.setCookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
    }

    return reply.code(coincidence.status).send(resValues); // 200 OK, o propaga error desde user-service

  } catch (err) {
    req.log.error(err, ''); // debug
    return reply.code(500).send({ error: 'Internal auth error' });
  }
});

fastify.post('/login/2fa', async (req, reply) => {
  try {
    const { username, code } = req.body || {};
    if (!username || !code) return reply.code(400).send({ error: 'Faltan datos' });

    const entry = pending2FA.get(username);
    if (!entry) return reply.code(400).send({ error: 'No hay 2FA pendiente' });

    if (entry.expires < Date.now()) {
      pending2FA.delete(username);
      return reply.code(400).send({ error: 'Código expirado' });
    }

    if (entry.code !== code) return reply.code(401).send({ error: 'Código incorrecto' });

    // Codigo correcto, generar JWT
    const token = jwt.sign({ userId: entry.userId, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    reply.setCookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });

    pending2FA.delete(username);
    return reply.code(200).send({ message: 'Autenticación 2FA exitosa' });

  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal auth error' });
  }
});

fastify.post('/logout', async (req, reply) => {

  if (auth.isLogged(req))
  {
    const username = req.body?.username || req.user?.username;
    //if (!username) return reply.code(200).send({ message: 'Logout unnecessary' });

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

fastify.post('/register', async (req, reply) => {
  try {
    const { username, password, email } = req.body || {};

    if (!username || !password || !email) {
      return reply.code(400).send({ error: 'Credenciales invalidas' });
    }

    const coincidence = await fetch('http://user-service:3000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    const resValues = await coincidence.json();

    if (!coincidence.ok) {
      return reply.code(coincidence.status).send(resValues);
    }
    const token = jwt.sign({ userId: resValues.userId, username: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    reply.setCookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });

    return reply.code(201).send(resValues);

  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal auth error' });
  }
});

fastify.post('/validate', async (req, reply) => {
  try {
    const coincidence = await fetch('http://user-service:3000/user/validate', {
      method: 'POST',
      headers: {
        cookie: req.headers.cookie
      }
    });

    const resValues = await coincidence.json();

    return reply.code(coincidence.status).send(resValues);

  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal auth error' });
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