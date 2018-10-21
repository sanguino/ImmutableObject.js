/* global describe, it, beforeEach */

const chai = require('chai')
chai.use(require('sinon-chai'))
chai.use(require('dirty-chai'))
const expect = chai.expect

const Immutable = require('../Immutable').Immutable

describe('Tests for Immutable.js', function () {
  describe('when a new Immutable is created', function () {
    it('should returns data object and lock and unlock functions', function () {
      let immutable = new Immutable()
      expect(immutable).to.be.an('object')
      expect(immutable.data).to.be.an('object')
      expect(immutable.lock).to.be.a('function')
      expect(immutable.unlock).to.be.a('function')
    })

    it('should returns data object that have same data passed to constructor', function () {
      let immutable = new Immutable({ num: 1 })
      expect(immutable.data.num).to.be.equal(1)
    })

    it('should returns error if you try to override data', function () {
      let immutable = new Immutable({ num: 1 })
      expect(function () {
        immutable.data = { num: 2 }
      }).to.throw('Object protected, you couldn\'t set data')
    })
  })

  describe('when data is an object', function () {
    describe('when immutable is locked', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable({ num: 1 })
        immutable.lock()
      })
      it('should throw error if you try to change any value', function () {
        expect(function () {
          immutable.data.num = 2
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throws error if you try to delete any key', function () {
        expect(function () {
          delete immutable.data.num
        }).to.throw('Object protected, you couldn\'t delete data')
      })

      it('should throws error if you try to create a new key', function () {
        expect(function () {
          immutable.data.otherNum = 3
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throws error if you try to create a new key using defineProperty', function () {
        expect(function () {
          Object.defineProperty(immutable.data, 'otherNum', {
            value: 3
          })
        }).to.throw('Object protected, you couldn\'t create data')
      })
    })

    describe('when immutable is unlocked', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable({ num: 1 })
        immutable.unlock()
      })
      it('should let you change any value', function () {
        expect(function () {
          immutable.data.num = 2
        }).to.not.throw()
        expect(immutable.data.num).to.be.equal(2)
      })

      it('should let you delete any key', function () {
        expect(function () {
          delete immutable.data.num
        }).to.not.throw()
        expect('num' in immutable.data).not.to.be.true()
      })

      it('should let you create a new key', function () {
        expect(function () {
          immutable.data.otherNum = 3
        }).to.not.throw()
        expect('otherNum' in immutable.data).to.be.true()
      })

      it('should let you create a new key using defineProperty', function () {
        expect(function () {
          Object.defineProperty(immutable.data, 'otherNum2', {
            value: 3
          })
        }).to.not.throw()
        expect('otherNum2' in immutable.data).to.be.true()
      })
    })

    describe('when unlock change and lock again', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable({ num: 1, otherNum: 2 })
        immutable.unlock()
      })
      it('should throw error if you try to change any value', function () {
        immutable.data.num = 2
        expect(immutable.data.num).to.be.equal(2)
        immutable.lock()
        expect(function () {
          immutable.data.num = 3
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throws error if you try to delete any key', function () {
        expect('otherNum' in immutable.data).to.be.true()
        delete immutable.data.otherNum
        expect('otherNum' in immutable.data).not.to.be.true()
        immutable.lock()
        expect(function () {
          delete immutable.data.num
        }).to.throw('Object protected, you couldn\'t delete data')
      })

      it('should throws error if you try to create a new key', function () {
        immutable.data.newNum = 3
        expect('newNum' in immutable.data).to.be.true()
        immutable.lock()
        expect(function () {
          immutable.data.otherNewNum = 3
        }).to.throw('Object protected, you couldn\'t set data')
      })
    })
  })

  describe('when data is an array', function () {
    describe('when immutable is locked', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable(['foo', 'bar'])
      })

      it('should throw error if you try to push items', function () {
        expect(function () {
          immutable.data.push('other')
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throw error if you try to unshift items', function () {
        expect(function () {
          immutable.data.unshift('other')
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throws error if you try pop an item', function () {
        expect(function () {
          immutable.data.pop()
        }).to.throw('Object protected, you couldn\'t delete data')
      })

      it('should throws error if you try shift an item', function () {
        expect(function () {
          immutable.data.shift()
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throws error if you try to edit any element', function () {
        expect(function () {
          immutable.data[0] = 'mod'
        }).to.throw('Object protected, you couldn\'t set data')
      })
    })

    describe('when immutable is unlocked', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable(['foo', 'bar'])
        immutable.unlock()
      })
      it('should let you push items', function () {
        expect(function () {
          immutable.data.push('other')
        }).to.not.throw()
        expect(immutable.data).to.be.an('array').that.includes('other')
      })

      it('should let you unshift items', function () {
        expect(function () {
          immutable.data.unshift('other')
        }).to.not.throw()
        expect(immutable.data).to.be.an('array').that.includes('other')
      })

      it('should let you pop an item', function () {
        let element
        expect(function () {
          element = immutable.data.pop()
        }).to.not.throw()
        expect(immutable.data).to.be.an('array').that.not.includes('bar')
        expect(element).to.be.equal('bar')
      })

      it('should let you shift an item', function () {
        let element
        expect(function () {
          element = immutable.data.shift()
        }).to.not.throw()
        expect(immutable.data).to.be.an('array').that.not.includes('foo')
        expect(element).to.be.equal('foo')
      })

      it('should let you edit any element', function () {
        expect(function () {
          immutable.data[0] = 'mod'
        }).to.not.throw()
        expect(immutable.data[0]).to.be.equal('mod')
      })
    })
  })

  describe('when data is an object with an element with an array', function () {
    describe('when immutable is locked', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable({ a: ['foo', 'bar'] })
      })
      it('should throw error if you try to push items', function () {
        expect(function () {
          immutable.data.a.push('other')
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throw error if you try to unshift items', function () {
        expect(function () {
          immutable.data.a.unshift('other')
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throws error if you try pop an item', function () {
        expect(function () {
          immutable.data.a.pop()
        }).to.throw('Object protected, you couldn\'t delete data')
      })

      it('should throws error if you try shift an item', function () {
        expect(function () {
          immutable.data.a.shift()
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throws error if you try to edit any element', function () {
        expect(function () {
          immutable.data.a[0] = 'mod'
        }).to.throw('Object protected, you couldn\'t set data')
      })
    })

    describe('when immutable is unlocked', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable({ a: ['foo', 'bar'] })
        immutable.unlock()
      })
      it('should let you push items', function () {
        expect(function () {
          immutable.data.a.push('other')
        }).to.not.throw()
        expect(immutable.data.a).to.be.an('array').that.includes('other')
      })

      it('should let you unshift items', function () {
        expect(function () {
          immutable.data.a.unshift('other')
        }).to.not.throw()
        expect(immutable.data.a).to.be.an('array').that.includes('other')
      })

      it('should let you pop an item', function () {
        let element
        expect(function () {
          element = immutable.data.a.pop()
        }).to.not.throw()
        expect(immutable.data.a).to.be.an('array').that.not.includes('bar')
        expect(element).to.be.equal('bar')
      })

      it('should let you shift an item', function () {
        let element
        expect(function () {
          element = immutable.data.a.shift()
        }).to.not.throw()
        expect(immutable.data.a).to.be.an('array').that.not.includes('foo')
        expect(element).to.be.equal('foo')
      })

      it('should let you edit any element', function () {
        expect(function () {
          immutable.data.a[0] = 'mod'
        }).to.not.throw()
        expect(immutable.data.a[0]).to.be.equal('mod')
      })
    })
  })
  describe('when data is an object with objects inside', function () {
    describe('when immutable is locked', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable({ foo: { bar: { num: 1 } } })
        immutable.lock()
      })
      it('should throw error if you try to change any value', function () {
        expect(function () {
          immutable.data.foo.bar.num = 2
        }).to.throw('Object protected, you couldn\'t set data')
      })

      it('should throws error if you try to delete any key', function () {
        expect(function () {
          delete immutable.data.foo.bar.num
        }).to.throw('Object protected, you couldn\'t delete data')
      })

      it('should throws error if you try to create a new key', function () {
        expect(function () {
          immutable.data.foo.bar.otherNum = 3
        }).to.throw('Object protected, you couldn\'t set data')
      })
    })

    describe('when immutable is unlocked', function () {
      let immutable
      beforeEach(() => {
        immutable = new Immutable({ foo: { bar: { num: 1 } } })
        immutable.unlock()
      })
      it('should let you change any value', function () {
        expect(function () {
          immutable.data.foo.bar.num = 2
        }).to.not.throw()
        expect(immutable.data.foo.bar.num).to.be.equal(2)
      })

      it('should let you delete any key', function () {
        expect(function () {
          delete immutable.data.foo.bar.num
        }).to.not.throw()
        expect('num' in immutable.data.foo.bar).not.to.be.true()
      })

      it('should let you create a new key', function () {
        expect(function () {
          immutable.data.foo.bar.otherNum = 3
        }).to.not.throw()
        expect('otherNum' in immutable.data.foo.bar).to.be.true()
      })
    })
  })
})
