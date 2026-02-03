import { faker } from '@faker-js/faker'
import connection from './db.js'
import usersQueries from './queries/users.js'

export default async function seedUsers() {
    await connection(async (conn) => {

        const rows = await usersQueries.getAllUsers()

        console.log(rows)

        if (rows[0]) {
            console.log('Users already exist, skipping seed')
            return
        }

        for (let i = 0; i < 10; i++)
            await usersQueries.addUser(faker.internet.username(), "Pass1!", faker.internet.email())

        console.log('Seeded 10 users')
    })
}
