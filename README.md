# Laite

Some times we want to be able to watch for changes and add reactivity in a very simple javascript app. This library aims
to bring in this reactivity in a very simple API. This is a lightweight mini library bringing reactivity to any website.

## Usage

```js
const objToWatch = { obj: { arr: [] } }
const lt = new Laite(tVisualizer)

lt.$watch('obj', (val) => console.log(val))
```

Deep watch is also available via `$deepWatch`

```js
const objToWatch = { obj: { arr: [] } }
const lt = new Laite(tVisualizer)

lt.$watch('obj.arr', (val) => console.log(val))
```