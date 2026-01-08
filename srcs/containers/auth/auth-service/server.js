import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', async () => {
  return { service: 'auth', status: 'running' };
});

fastify.listen({ port: 3000, host: '0.0.0.0' });
