const fs = require("fs");
const glob = require('glob')
const hash = require('object-hash')
const Hjson = require('hjson')
const LRU = require('lru-cache')
const mockjs = require('mockjs')
const path = require('path')

const mock = mockjs.mock
const defaultOptions = { cache: true, cachePool: 500 }

const funcBuild = (file, dirpath) => {
  const suffix = /\.\w+$/.exec(file)[0]
  const filepath = path.resolve(dirpath, file)
  if (suffix === '.hjson') {
    const hjson = fs.readFileSync(filepath, 'utf8')
    return () => Hjson.parse(hjson)
  }
  const content = require(filepath)
  if (suffix === '.js') {
    return content
  }

  if (suffix === '.json') {
    return () => mock(content)
  }
  throw new Error('后缀名不匹配')
}

const parse = (dirpath, _options) => {
  const options = Object.assign({}, defaultOptions, _options || {})
  const lruCache = new LRU({ max: options.cachePool || 500, maxAge: 1000 * 60 * 60 })

  const $datasources = glob
    .sync('**/*+(.hjson|.json|.js)', { cwd: dirpath, dot: false })
    .reduce((accu, cuur) => {
      accu[cuur] = funcBuild(cuur, dirpath)
      return accu
    }, {})

  return async (name, params, extra = { cache: false, cacheAge: 10 * 60 * 1000, cacheKey: null }) => {
    if (!extra.cache) {
      return await $datasources[name](params)
    }
    const cacheKey = (() => {
      if (typeof extra.cacheKey === 'string') {
        return cacheKey
      }
      if (typeof extra.cacheKey === 'function') {
        return extra.cacheKey()
      }
      const obj = Object.assign({}, params)
      obj[name] = true
      return hash(obj)
    })()
    if (!lruCache.has(cacheKey)) {
      lruCache.set(cacheKey, await $datasources[name](params), extra.cacheAge)
    }

    return lruCache.get(cacheKey)
  }
}

module.exports = parse

