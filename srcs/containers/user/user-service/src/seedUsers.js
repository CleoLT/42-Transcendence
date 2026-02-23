import { faker } from '@faker-js/faker'
import db from './db.js'
import usersQueries from './queries/users.js'
import friendshipsQueries from './queries/friendships.js'

export default async function seedUsers() {
    await db.connection(async (conn) => {

        const rows = await usersQueries.getAllUsers()

        if (rows[0]) {
            console.log('Users already exist, skipping seed')
            return
        }

        const nb = 20

        for (let i = 0; i < nb; i++)
            await usersQueries.addUser(faker.internet.username(), "Pass1!", faker.internet.email())

        console.log('Seeded 20 users')

        await usersQueries.addUser("Cleo", "Pass1!", "cleo.letron@gmail.com")


        for (let i = 1; i <= nb; i += 2)
            await friendshipsQueries.createFriendship(i, nb + 1, true)

        for (let i = 1; i <= nb / 2; i += 2)
            await friendshipsQueries.acceptPendingFriendship(i, nb + 1, false)
        
        for (let i = 2; i <= nb; i += 2)
            await friendshipsQueries.createFriendship(i, nb + 1, false)

        for (let i = nb / 2; i <= nb; i += 2)
            await friendshipsQueries.acceptPendingFriendship(i, nb + 1, true)

    })
}
