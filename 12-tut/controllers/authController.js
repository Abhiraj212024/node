const userDB = {
    users : require('../models/users.json'),
    setUsers: function(data) { this.users = data }
}

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
    const { user, pass } = req.body
    if(!user || !pass) return res.status(400).json({
        'message': 'Username and password are required.'
    })

    const foundUser = userDB.users.find(person => person.username === user);
    if(!foundUser) return res.sendStatus(401);
    //evaluate password
    const match = await bcrypt.compare(pass, foundUser.password)

    if(match) {
        const roles = Object.values(foundUser.roles)
        //create JWTs
        const accessToken = jwt.sign(
            { 
                "UserInfo" : {
                    'username' : foundUser.username,
                    'roles': roles
                } 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '45s' }
        )
        const refreshToken = jwt.sign(
            { 
                "UserInfo" : {
                    'username' : foundUser.username,
                    'roles': roles
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        //store refreshToken with current user
        const otherUsers = userDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = { ...foundUser, refreshToken}
        userDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(userDB.users)
        )
        console.log("Refresh token saved to database")
        const cookieAge = 24*60*60*1000 //one day
        // httpOnly cookie is not available to JavaScript, more secure than storing in local storage
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: cookieAge })
        res.json({ accessToken })
    }else{
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }