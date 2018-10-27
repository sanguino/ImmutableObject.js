function ProxyPolyfill () {
  if (typeof Proxy === 'undefined') {
    Proxy = function (source) { return source }
  }
}

module.exports = {
  ProxyPolyfill: ProxyPolyfill
}