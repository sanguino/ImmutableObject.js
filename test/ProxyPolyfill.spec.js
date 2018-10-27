/* global describe, it, beforeEach */

const chai = require('chai')
chai.use(require('sinon-chai'))
chai.use(require('dirty-chai'))
const expect = chai.expect

const ProxyPolyfill = require('../ProxyPolyfill').ProxyPolyfill

describe('Tests for ProxyPolyfill.js', function () {
  describe('when a browser don\'t implement Proxy class', function () {
    it('should be replaced by a function that returns original data', function () {
      const realProxy = Proxy
      Proxy = undefined
      new ProxyPolyfill()
      expect(Proxy).to.be.an('function')
      expect(Proxy).to.not.be.equal(realProxy)
      const data = {num: 1}
      const dataCreated = new Proxy(data)
      expect(data).to.be.equal(dataCreated)
      Proxy = realProxy
    })
  })

  describe('when a browser implement Proxy class', function () {
    it('should do nothing', function () {
      new ProxyPolyfill()
      expect(Proxy).to.be.an('function')
      const data = {num: 1}
      const dataCreated = new Proxy(data, {})
      expect(data).to.not.be.equal(dataCreated)
    })
  })
})
