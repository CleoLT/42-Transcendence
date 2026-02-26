import Fastify from 'fastify';
import auth from './auth.js';
import jwt from 'jsonwebtoken';
import cookie from '@fastify/cookie';
import nodemailer from 'nodemailer';
import fs from 'fs';

const fastify = Fastify({ logger: true });

fastify.register(cookie);

export function readSecret(path) {
  return fs.readFileSync(path, 'utf8').trim()
}

// 2FA en memoria
const pending2FA = new Map();

// Mail transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: readSecret(process.env.MAILER_EMAIL),
    pass: readSecret(process.env.MAILER_PASSWORD)
  }
});

fastify.get('/', async () => {
  return { service: 'auth', status: 'running' };
});

fastify.post('/login', async (req, reply) => {
  try {
    const { username, password } = req.body || {};
    if (auth.checkActiveSession(req))
      return reply.code(403).send({ error: 'There is an active session' });

    if (!username || !password) return reply.code(400).send({ error: 'Invalid credentials' });

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
        from: readSecret(process.env.MAILFROM_FILE),
        to: resValues.email,
        subject: '2FA code',
        text: `Your verification code is: ${code2FA}`
      });

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

    if (!username || !code) return reply.code(400).send({ error: 'Missing data' });

    const entry = pending2FA.get(username);

    if (!entry) return reply.code(400).send({ error: 'No pending 2FA' });

    if (entry.expires < Date.now()) {
      pending2FA.delete(username);
      return reply.code(400).send({ error: 'Expired code' });
    }

    if (entry.code !== code) return reply.code(401).send({ error: 'Incorrect code' });

    //const resValues = entry.user || { userId: entry.userId };
    const token = jwt.sign(
      { userId: entry.userId, username: username },
      readSecret(process.env.JWT_SECRET_FILE),
      { expiresIn: '30d' }
    );

    reply.setCookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });

    pending2FA.delete(username);
    return reply.code(200).send({ message: 'Successful 2FA' });

  } catch (err) {
    console.error('[2FA] CATCH ERROR:', err);
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

fastify.post('/register/2fa', async (req, reply) => {
  try {
    const { username, code } = req.body || {};

    if (!username || !code) return reply.code(400).send({ error: 'Missing data' });

    const entry = pending2FA.get(username);
    const { email, password } = entry;

    if (!entry) return reply.code(400).send({ error: 'No pending 2FA' });

    if (entry.expires < Date.now()) {
      pending2FA.delete(username);
      return reply.code(400).send({ error: 'Expired code' });
    }

    if (entry.code !== code) return reply.code(401).send({ error: 'Incorrect code' });

    const coincidence = await fetch('http://user-service:3000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    const resValues = await coincidence.json();

    if (!coincidence.ok)
      return reply.code(coincidence.status).send(resValues);

    //const resValues = entry.user || { userId: entry.userId };
    const token = jwt.sign(
      { userId: resValues.id, username: username },
      readSecret(process.env.JWT_SECRET_FILE),
      { expiresIn: '30d' }
    );

    reply.setCookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });

    pending2FA.delete(username);
    return reply.code(200).send({ message: 'Successful 2FA' });

  } catch (err) {
    console.error('[2FA] CATCH ERROR:', err);
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal auth error' });
  }
});

fastify.post('/register', async (req, reply) => {
  try {
    const { username, password, email } = req.body || {};

    if (!username || !password || !email) {
      return reply.code(400).send({ error: 'Invalid credentials' });
    }

    const code2FA = Math.floor(100000 + Math.random() * 900000).toString();
    pending2FA.set(username, { 
      code: code2FA,
      userId: 0, // userId = 0 temporal
      email,
      password,
      expires: Date.now() + 5*60*1000
    });

    req.log.info({ email }, '2FA email destination'); // debug
    await transporter.sendMail({
      from: readSecret(process.env.MAILFROM_FILE),
      to: email,
      subject: '2FA code',
      text: `Your verification code is: ${code2FA}`
    });

    return reply.code(201).send({ email });

  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'Internal auth error' });
  }
});

fastify.post('/validate', async (req, reply) => {
  try {

    const token = req.cookies.access_token;
    const { lastUserId } = req.body || {};

    if (!token) {
      if (lastUserId) {
        await fetch('http://user-service:3000/user/disconnect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': readSecret(process.env.API_KEY)
          },
          body: JSON.stringify({ userId: lastUserId })
        });
      }
      return reply.code(200).send({ valid: false });
    }

    const decoded = jwt.verify(token, readSecret(process.env.JWT_SECRET_FILE));
    await fetch('http://user-service:3000/user/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': readSecret(process.env.API_KEY)
      },
      body: JSON.stringify({ userId: decoded.userId })
    });

    return reply.code(200).send({
      valid: true,
      userId: decoded.userId,
      username: decoded.username
    });

  } catch (err) {
    console.error("JWT Error: ", err.message);
    return reply.code(401).send({ valid: false, message: "Not authenticated" });
  }
});

fastify.post('/update/:username', async (req, reply) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return reply.code(401).send({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, readSecret(process.env.JWT_SECRET_FILE));

    const newUsername = req.params.username;
    if (!newUsername) return reply.code(400).send({ error: 'Missing username' });

    const newToken = jwt.sign(
      { userId: decoded.userId, username: newUsername },
      readSecret(process.env.JWT_SECRET_FILE),
      { expiresIn: '30d' }
    );

    reply.setCookie('access_token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/'
    });

    return reply.code(200).send({ message: 'Username updated' });

  } catch (err) {
    req.log.error(err);
    return reply.code(401).send({ error: 'Invalid token' });
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


export default {readSecret}

start()