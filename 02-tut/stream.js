const fs = require('fs')

const rs = fs.createReadStream('./files/lorem.txt', { encoding: 'utf8' })
const ws = fs.createWriteStream('./files/lorem2.txt')

rs.on('data', (chunk) => {
    console.log('--- New Chunk ---')
    console.log(chunk)
    ws.write(chunk)
})

//Alternate way
rs.pipe(ws)