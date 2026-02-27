import authHandler from './auth.js'

const routes = async function(fastify, options) {

fastify.get('/', authHandler.status)
fastify.post('/login', authHandler.login)
fastify.post('/login/2fa', authHandler.login2FA)
fastify.post('/logout', authHandler.logout)
fastify.post('/register', authHandler.register)
fastify.post('/register/2fa', authHandler.register2FA)
fastify.post('/validate', authHandler.validate)
fastify.post('/update/:username', authHandler.updateUsername)

}

export default routes