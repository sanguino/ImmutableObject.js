# ImmutableObject.js

[![Build Status](https://travis-ci.org/sanguino/ImmutableStore.svg?branch=master)](https://travis-ci.org/sanguino/ImmutableStore)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


ImmutableObject.js package let you lock any object to prevent to modify it in any way. But with the capacity to unlock and lock whenever you want. Other immutable packages uses 'get' and 'set' and other functions to do that. So anyone needs to learn how to modify the object, but ImmutableObject.js use native objects, so you access and modify it in a natural way. 
 
When ImmutableObject.js is constructed it returns an object with 3 keys: data (proxied object) and lock/unlock functions.

You should create the ImmutableObject.js in a reducer, and return de data. Don't expose lock and unlock functions. Save a reference to use it in the reducer.
Unlock data just before any modification and lock it after the modification.

See test for examples 

## Polyfill

This package uses Proxy class. But is not possible to create a polyfill for this class.
The intention of this package is to prevent a developer mutate the object where is not intended to edit it. 
So if we assume that the developer is going to use any browser that has Proxy Class, we can use a "Polyfill" that don't make the object immutable.
The immutability is only to prevent development errors, not execution errors.

(this doc is in progress)
