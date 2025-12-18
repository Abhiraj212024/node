const fsPromises = require('fs').promises
const { unlink } = require('fs')
const path = require('path')

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf-8')
        console.log(data)
        await unlink(path.join(__dirname, 'files', 'starter.txt'), (err) => {
            if (err) throw err
            console.log('starter.txt was deleted')
        })
        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data)
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you')
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'))
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf-8')
        console.log(newData)
    } catch (err) {
        console.error(err)
    }
}

fileOps()

/* 
console.log(path.join(__dirname, 'files', 'starter.txt'))

fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8', (err, data) => {
    if (err) throw err
    // console.log(data) //reads buffer data is utf-8 not mentioned
    console.log(data.toString()) //reads string data
})

let stuff_to_write = "Hello, nice to meet you!"
let stuff_to_append = "\nYes it is" */


//Callback hell

/* 
fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), stuff_to_write, (err) => {
    if (err) throw err
    // console.log(data) //reads buffer data is utf-8 not mentioned
    console.log('Write Complete') //reads string data

    fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), stuff_to_append, (err) => { //creates a new file if non existent
        if (err) throw err
        // console.log(data) //reads buffer data is utf-8 not mentioned
        console.log('Append Complete') //reads string data
        fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt'), (err) => {
            if (err) throw err
            console.log("Rename complete")
        })
    })
})
 */


process.on('uncaughtException', (err) => {
    console.error(`There was an uncaught error: ${err}`)
    process.exit(1) //mandatory (as per the Node docs)
})