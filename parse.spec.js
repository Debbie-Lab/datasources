const path = require('path')

const datasources = require('./parse')

console.log(datasources)

const func = datasources(path.resolve(__dirname, '__debug__dir__/datasources'))

console.log(func)

