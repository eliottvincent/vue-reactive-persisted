# Vue Reactive Persisted

[![Build Status](https://github.com/eliottvincent/vue-reactive-persisted/actions/workflows/test.yml/badge.svg)](https://github.com/eliottvincent/vue-reactive-persisted/actions) [![Version](https://img.shields.io/npm/v/vue-reactive-persisted.svg)](https://www.npmjs.com/package/vue-reactive-persisted) [![Downloads](https://img.shields.io/npm/dt/vue-reactive-persisted.svg)](https://www.npmjs.com/package/vue-reactive-persisted)

Persists a Vue reactive object in the browser's localStorage. Avoids loosing state between page reloads or when the browser is closed.

Inspired by [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate).

## Usage

```js
import { reactive } from "vue";
import persist from "vue-reactive-persisted";

const state = reactive({
  message: "hello world",
  count: 0
});

persist(state);

state.count++;

console.log(window.localStorage.getItem("reactive_persisted"));
// {"message":"hello world","count":1}
```


## API

### Persists a Vue reactive object
`persist(object, options)` persists and returns the Vue reactive object:
* `object` must be the Vue reactive object to persist
* `options` an object of options to configure the behavior:
  * `key`: the key to store the Vue reactive object under in localStorage (defaults to `reactive_persisted`)
  * `paths`: an array of paths to partially persist, specified using dot-notation (defaults to `null`).
  If the array is empty, no paths are persisted. If omitted, the complete reactive object is persisted.

```js
import { reactive } from "vue";
import persist from "vue-reactive-persisted";

const state = reactive({
  message: "hello world",
  count: 0,

  nested: {
    count: 0
  }
});

persist(
  state,

  {
    key: "custom_key",
    paths: [
      "message",
      "nested.count"
    ]
  }
);

state.message = "hey!";
state.count++;
state.nested.count++;

console.log(window.localStorage.getItem("custom_key"));
// {"message":"hey!","count":0,"nested":{"count":1}}
```


## License

vue-reactive-persisted is released under the MIT License. See the bundled LICENSE file for details.
