const path = require('path')
const fsPromises = require('fs').promises


const handleLogout = async (req, res) => {
    //On client, also delete the access token
    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(204); //No content

    const refreshToken = cookies.jwt

    //Read the entire database again to ensure updation
    const users = JSON.parse(
        await fsPromises.readFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            'utf-8'
        )
    )
    const cookieAge = 24*60*60*1000 //one day
    const foundUser = users.find(person => person.refreshToken === refreshToken)
    if(!foundUser){
        // No user found, clear the cookie
        console.log('User not found, deleting cookie')
        
        res.clearCookie('jwt', { httpOnly: true, maxAge: cookieAge})
        return res.sendStatus(204)
    }

    //delete refreshToken
    const otherUsers = users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify([...otherUsers, currentUser]),
        'utf-8'
    )

    res.clearCookie('jwt', { httpOnly: true, maxAge: cookieAge }) //secure: true - only serves on https
    res.sendStatus(204)
}

module.exports = { handleLogout }