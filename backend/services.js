const bcrypt = require('bcrypt');
const query = require('./queries')

function login(username, plainPassword) {
    const user = query.getUserByUserName(username);
    if (!user)
        return null;
    if (!bcrypt.compareSync(plainPassword, user.password))
        return null;
    return user;
}

module.exports = {
  login
}
