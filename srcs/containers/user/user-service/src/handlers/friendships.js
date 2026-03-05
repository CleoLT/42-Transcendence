import query from '../queries/friendships.js'
import userHandlers from './users.js'

function normalizeIds(id1, id2) {
  if (id1 > id2)
    return { idA: id2, idB: id1, revert: true }
  else
    return { idA: id1, idB: id2, revert: false }
}

async function checkIfTwoIdsAreCorrect(id1, id2) {
    if (id1 === id2) {
        const err = new Error('Cannot use the same id')
        err.statusCode = 400
        err.name = 'Bad Request'
        throw err
    }
    await userHandlers.checkIfUserExists(id1)
    await userHandlers.checkIfUserExists(id2)
}

async function checkIfFriendshipExists(id1, id2) {
    const rows = await query.getFriendshipById(id1, id2)
    if (rows === null) {
        const err = new Error('Friendship not found')
        err.statusCode = 404
        err.name = 'Not Found'
        throw err
    }
}

async function checkIfAreFriends(id1, id2) {
    const friend = await query.checkIfAreFriends(idA, idB)
        if (friend === null) {
            const err = new Error('Users are not friends')
            err.statusCode = 403
            err.name = 'Forbidden'
            throw err
        }    
}

/*-----------------HANDLERS-----------------*/

async function getAllFriendships(req, reply) {
    const friendships = await query.getAllFriendships()
    reply.code(200).send(friendships);
}

async function getAllFriendsByUserId(req, reply) {
    const { userId } =  req.params

    try {
        await userHandlers.checkIfUserExists(userId)
        const result = await query.getFriendsByUserId(userId)
        reply.code(200).send(result) 
    } catch(err) {
        reply.send(err)
    }
}

async function getPendingFriendships(req, reply) {
    const { userId } =  req.params

    try {
        await userHandlers.checkIfUserExists(userId)
        const result = await query.getPendingFriendships(userId)
        reply.code(200).send(result) 
    } catch(err) {
        reply.send(err)
    }
}

async function getReceivedFriendRequests(req, reply) {
    const { userId } =  req.params
 
    try {
        await userHandlers.checkIfUserExists(userId)
        const result = await query.getReceivedFriendRequests(userId)
        reply.code(200).send(result) 
    } catch(err) {
        reply.send(err)
    }
}

async function newFriendship(req, reply) {

    let { id1, id2 } = req.body;

    try {
        await checkIfTwoIdsAreCorrect(id1, id2)
        const { idA, idB, revert } = normalizeIds(id1, id2)
    
        const rows = await query.getFriendshipById(idA, idB)
        if (rows !== null) {
            const err = new Error('Friendship already exists')
            err.statusCode = 409
            err.name = 'Conflict'
            throw err
        }

        await query.createFriendship(idA, idB, revert)
        const friendship = await query.getFriendshipById(idA, idB)
        reply.code(201).send(friendship)
    } catch(err) {
        reply.send(err)
    }
}

async function acceptFriendship(req, reply) {

    let { id1, id2 } = req.body;

    try
    {
        await checkIfTwoIdsAreCorrect(id1, id2)
        const { idA, idB, revert } = normalizeIds(id1, id2)
        await checkIfFriendshipExists(idA, idB)
    
        await query.acceptPendingFriendship(idA, idB, revert)
        const friendship = await query.getFriendshipById(idA, idB)
        reply.code(201).send(friendship)
    } catch(err) {
        reply.send(err)
    }
}

async function addAuthorizationToPlay(req, reply) {
    let { id1, id2 } = req.body;

    try {
        await checkIfTwoIdsAreCorrect(id1, id2)
        const { idA, idB, revert } = normalizeIds(id1, id2)
        await checkIfFriendshipExists(idA, idB)
        await checkIfAreFriends(idA, idB)

        await query.authorizeToPlay(idA, idB, revert)
        const friendship = await query.getFriendshipById(idA, idB)
        reply.code(201).send(friendship)
    } catch(err) {
        reply.send(err)
    }
}

async function cancelFriendship(req, reply) {
    let { id1, id2 } = req.body;

    try {
        await checkIfTwoIdsAreCorrect(id1, id2)
        const { idA, idB, revert } = normalizeIds(id1, id2)
        await checkIfFriendshipExists(idA, idB)

        await query.cancelFriendship(idA, idB, revert)
        reply.code(201)
    } catch(err) {
        reply.send(err)
    }
}

async function cancelAuthorization(req, reply) {
    let { id1, id2 } = req.body;

    try {
        await checkIfTwoIdsAreCorrect(id1, id2)
        const { idA, idB, revert } = normalizeIds(id1, id2)
        await checkIfFriendshipExists(idA, idB)
        await checkIfAreFriends(idA, idB)

        await query.cancelAuthorization(idA, idB, revert)
        const friendship = await query.getFriendshipById(idA, idB)
        reply.code(201).send(friendship)
    } catch (err) {
        reply.send(err)
    }
}

export default {
    getAllFriendships,
    getAllFriendsByUserId,
    getPendingFriendships,
    getReceivedFriendRequests,
    newFriendship,
    acceptFriendship,
    addAuthorizationToPlay,
    cancelFriendship,
    cancelAuthorization
}