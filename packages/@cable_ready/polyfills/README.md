# Polyfills for CableReady

### Description

The `@cable_ready/polyfills` package provides support for CableReady in older browsers like Internet Explorer 11.

### Usage

To include the polyfills you just have to import the package. Typically you want to import it in `app/javascript/packs/application.js`.

```javascript
// app/javascript/packs/application.js

import '@cable_ready/polyfills'

// ...
```

### Details

This repository contains a few polyfills itself and bundles up polyfills from other packages. The following list shows the included polyfills and where they are coming from:

#### Polyfills imported in this package

* Custom
  * [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill)

* [core-js](https://www.npmjs.com/package/core-js)
  * `Array.flat()`
  * `Array.forEach()`
  * `Array.from()`
  * `Array.includes()`
  * `Object.entries()`
  * `Promise`

#### Polyfills imported from `element-closest`
* [`Element.closest()`](https://www.npmjs.com/package/element-closest)

#### Polyfills imported from `@webcomponents/template`
* [`<template>`](https://www.npmjs.com/package/@webcomponents/template)
