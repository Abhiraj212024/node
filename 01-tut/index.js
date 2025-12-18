// 1) Node runs on a server - not in a browser
// 2) The console is the terminal window
console.log("Hello, World!");
// 3) Global object instead of window object
// console.log(global)

// 4) Has common core modules that we will explore
// 5) CommonJS modules instead of ES6 modules
// 6) Missing some JS API's like fetch


const os = require('os')
const path = require('path')
// const math = require('./math.js')
const { add, subtract, multiply, divide } = require('./math.js')

console.log(add(2, 4))
/* 
console.log(os.type())
console.log(os.version())
console.log(os.homedir())

console.log(__dirname)
console.log(__filename)

console.log(path.dirname(__filename))
console.log(path.basename(__filename)) //index.js
console.log(path.extname(__filename)) //.js

console.log(path.parse(__filename)) */