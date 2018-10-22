# ImmutableStore

ImmutableStore package let you lock any object to prevent to modify it in any way. Other immutable packages uses 'get' and 'set' and other functions to do that. So anyone needs to learn how to modify the object, but ImmutableStore use native objects, so you access and modify it in a natural way. 
 
When ImmutableStore is constructed it returns an object with 3 keys: data (proxied object) and lock/unlock functions.

You should create the ImmutableStore in a reducer, and return de data. Don't expose lock and unlock functions. Save a reference to use it in the reducer.
Unlock data just before any modification and lock it after the modification.

See test for examples 

## Polyfill

This package uses Proxy class. But is not possible to create a polyfill for this class.
The intention of this package is to prevent a developer mutate the store not using a reducer. 
So if we assume that the developer is going to use any browser that has Proxy Class, we can use a "Polyfill" that don't make the object mutable.
The immutability is only to prevent development errors, not execution errors. 

(this doc is in progress)
