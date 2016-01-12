falcro
---

falcor as a component

`npm install falcro falcor --save`


```jsx

// instantiate a model, matching paths to data sources
let model = new Model({
  cache: {...},
  source: new Router([...])
});


// include the Root component somewhere up in your component hierarchy
render(){
  return <Root model={model}>
    <App/>
  </Root>;
}


// and then fetch anywhere in your app
<Get query={`{ users { ${name} } }`}>{
  ({users, error, loading, $ : {setValue, refresh, call }}) =>
    <div>{...}</div>
}</Get>


// all the falcor goodies for free - batching, caching, etc
```

Model
---

(see [falcor.Model](https://netflix.github.io/falcor/doc/Model.html))

Root
---

- model - instance of Model

Get
---

- query - falcor model query. accepts [falcor-path-syntax](https://www.npmjs.com/package/falcor-path-syntax) or [falcor-graph-syntax](https://www.npmjs.com/package/falcor-graph-syntax)
- onNext/onDone - callbacks, optional
- children - a function, that will receive -
  - ...value - ie, the result of the query
  - error - if errored
  - loading - _true_ if a request is in flight
  - $ - actions on the model instance - _setValue_, _call_, and _refresh_ (more to come)

examples
---

use [react-heatpack](https://github.com/insin/react-heatpack) to run examples from `/examples` directory


todo
---

*so much*
- refreshing *only* the components that change
- streaming results
- server side rendering
- redux scenarios (reduce/rewind/replay/etc)
- idents
- derefs
- etc etc





