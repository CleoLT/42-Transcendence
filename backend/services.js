const bcrypt = require('bcrypt');
const query = require('./queries')

function login(username, plainPassword) {
    const user = query.getUserByUserName(username);
    if (!user)
        throw new Error('USER_NOT_FOUND');
    if (user.online_status === 1)
        throw new Error('ALREADY_ONLINE');
    if (!bcrypt.compareSync(plainPassword, user.password))
        throw new Error('INVALID_PASSWORD');
    query.updateUserById(user.id, { online_status: 1 });
    return user;
}

module.exports = {
  login
}
