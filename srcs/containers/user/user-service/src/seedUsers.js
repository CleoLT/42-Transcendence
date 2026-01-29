import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import connection from './db.js'

async function seedUsers() {
  await connection(async (conn) => {

    const rows = await conn.query(
      'SELECT COUNT(*) as count FROM users'
    )

    if (rows[0].count > 0) {
      console.log('Users already exist, skipping seed')
      return
    }

    const users = []

    for (let i = 0; i < 10; i++) {
      const passwordHash = await bcrypt.hash('Password1!', 10)

      users.push([
        faker.internet.userName(),
        faker.internet.email(),
        passwordHash
      ])
    }

    await conn.query(
      'INSERT INTO users (username, email, password) VALUES ?',
      [users]
    )

    console.log('Seeded 10 users 🌱')
  })
}

seedUsers().catch(console.error)
