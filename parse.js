const camelcase = require('camelcase')
const glob = require('glob')
const hjson = require('hjson')
const LRU = require('lru-cache')
const mockjs = require('mockjs')

const defaultOptions = {
  cache: true,
  cachePool: 500
}

const parse = (dirpath, _options) => {
  const options = Object.assign({}, defaultOptions, _options || {})
  const lruCache = new LRU({
    max: options.cachePool || 500,
    maxAge: 1000 * 60 * 60,
  })

  const files = glob.sync('**/*+(.mock|.hjson|.json|.js)', { cwd: dirpath, dot: false })
    .map((file, idx, arr) => {
      const fileType = /\.\w+$/.exec(file)[0]
      console.log(file, fileType)
    })

  return () => {

  }

}

module.exports = parse

