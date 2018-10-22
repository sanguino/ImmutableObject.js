function Immutable (source = {}) {
  let writable = true

  const validator = {
    get (target, key) {
      return target[key]
    },
    set (target, key, value) {
      if (!writable) {
        throw new Error('Object protected, you couldn\'t set data')
      }
      if (typeof value === 'object' && value !== null) {
        target[key] = new Proxy(value, validator)
        for (const [k, v] of Object.entries(value)) {
          target[key][k] = v
        }
      } else {
        target[key] = value
      }
      return true
    },
    deleteProperty (target, prop) {
      if (!writable) {
        throw new Error('Object protected, you couldn\'t delete data')
      }
      delete target[prop]
      return true
    },
    defineProperty (target, prop, options) {
      if (!writable) {
        throw new Error('Object protected, you couldn\'t create data')
      }
      Object.defineProperty(target, prop, options)
      return true
    }
  }

  const data = new Proxy(source, validator)
  for (const [key, val] of Object.entries(source)) {
    data[key] = val
  }
  writable = false

  return new Proxy({
    data: data,
    lock: () => { writable = false },
    unlock: () => { writable = true }
  }, validator)
}

module.exports = {
  Immutable: Immutable
}
