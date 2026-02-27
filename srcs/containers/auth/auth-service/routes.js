import authHandler from './auth.js'
import authSchema from './schemas/authschemas.js'

const routes = async function(fastify, options) {

fastify.get('/', { schema: authSchema.statusSchema }, authHandler.status)
fastify.post('/login', { schema: authSchema.loginSchema }, authHandler.login)
fastify.post('/login/2fa', { schema: authSchema.login2FASchema }, authHandler.login2FA)
fastify.post('/logout', { schema: authSchema.logoutSchema }, authHandler.logout)
fastify.post('/register', { schema: authSchema.registerSchema }, authHandler.register)
fastify.post('/register/2fa', { schema: authSchema.register2FASchema }, authHandler.register2FA)
fastify.post('/validate', { schema: authSchema.validateSchema }, authHandler.validate)
fastify.post('/update/:username', { schema: authSchema.updateUsernameSchema }, authHandler.updateUsername)

}

export default routes