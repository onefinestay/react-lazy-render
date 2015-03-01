React Lazy Render
=================

Lazy render for (very) large lists of data

[Demo](http://onefinestay.github.io/react-lazy-render/)

## Features

* Only render children that are visible
* Incredibly simple to use
* BYOC - Bring your own child components

## Install

The easiest way to use **React Lazy Render** is to install it from NPM and include it in
your own build process (using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/), etc).

```bash
npm install react-lazy-render
```

## Usage

```js
var LazyRender = require('react-lazy-render');

var children = [];
for (var i = 0; i < 5000; i++) {
  // each child must have a consistent height
  children.push(
    <div style={{ height: 20 }}>
      #{i}
    </div>
  );
}

<LazyRender maxHeight={300} className="my-list" itemPadding={5}>
  {children}
</LazyRender>
```

## Contribute

We love contributions! Whether it is a simple typo fix or a wholesale rewrite to
Haskell we'll get it merged as soon as we can. If you can't think of anything to
do you can see a list of tasks that can be worked on in the [issues list](https://github.com/onefinestay/react-lazy-render/issues).

### Building example page

Once you have the repository cloned run the following commands to get started:

```shell
npm install
npm install -g webpack gulp // we use webpack to build the js for the example page
```

Then in one shell run `gulp develop` and in another `webpack -w --colors --progress`.
This will start a local server at `http://localhost:9988` where you can see the
example page. It will also watch for any files changes and rebuild.
