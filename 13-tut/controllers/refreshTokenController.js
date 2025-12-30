const path = require('path')
const fsPromises = require('fs').promises
const jwt = require('jsonwebtoken')


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log("Received refresh token: ")
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt

    //Read the entire database again to ensure updation
    const users = JSON.parse(
        await fsPromises.readFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            'utf-8'
        )
    )

    const foundUser = users.find(person => person.refreshToken === refreshToken)
    if(!foundUser){
        console.log("No user found with this refresh token")
        console.log(`Available refresh tokens in DB: `, users.map(u => ({
            "username": u.username,
            "refreshToken": u.refreshToken
        })))
        return res.sendStatus(403)
    }
    console.log(`Found User: ${foundUser.username}`)
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "45s" }
            )
            res.json({ accessToken })
        }
    )
}

module.exports = { handleRefreshToken }