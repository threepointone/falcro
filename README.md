falcro
---

[work in progress]

falcor as a component

`npm install react falcor falcro --save`


```jsx
// instantiate a model, matching paths to data sources
let model = new Model({
  cache: {...},
  source: new Router([...])
});

// include the Root component somewhere up in your component hierarchy
function App(){
  return <Root model={model}>
    <User name='threepointone' />
  </Root>;
}

// and then fetch anywhere in your app
function User({name}){
  return <Get query={`users.${name}['avatar_url', 'id']`}>{
    ({users, error, loading, $: {setValue, refresh, call}}) =>
      <img src={users[name].avatar_url} alt={users[name].id} />
  }</Get>;
}

// all the falcor goodies for free - batching, caching, .set/.call, etc

//BONUS - server side async rendering
renderToString(<App/>, model).then(html => res.send(html))
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
- children - a function, that will receive, on render -
  - ...value - ie, the result of the query
  - error - if errored
  - loading - _true_ if a request is in flight
  - $ - actions on the model instance - _setValue_, _call_, and _refresh_ (more to come)

renderToString(element, model)
---

 - returns a promise, which resolves to the html


examples
---

use [react-heatpack](https://github.com/insin/react-heatpack) to run examples from `/examples` directory


todo
---

*so much*
- refreshing *only* the components that change
- streaming results
- server side rendering
- redux/router scenarios (reduce/rewind/replay/etc)
- shallow render testing
- idents
- derefs
- etc etc





