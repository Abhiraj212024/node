const userDB = {
    users : require('../models/users.json'),
    setUsers: function(data) { this.users = data }
}

const bcrypt = require('bcrypt')

const handleLogin = async (req, res) => {
    const { user, pass } = req.body
    if(!user || !pass) return res.status(400).json({
        'message': 'Username and password are required.'
    })

    const foundUser = userDB.users.find(person => person.username === user);
    if(!foundUser) return response.sendStatus(401);
    //evaluate password
    const match = await bcrypt.compare(pass, foundUser.password)

    if(match) {
        //create JWTs
        res.json({
            'success' : `User ${user} is logged in.`
        })
    }else{
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }