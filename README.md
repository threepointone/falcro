falcro
---

(work in progress)

"inspiration"
---

- [redux](https://rackt.github.io/redux/)
- [om.next](https://github.com/omcljs/om/)
- [graphql](https://facebook.github.io/graphql/) / [relay](https://facebook.github.io/relay)
- [falcor](https://netflix.github.io/falcor)
- etc


counter
---

```jsx
import React, {Component} from 'react';
import {render} from 'react-dom';
import {app, connect, Provider} from 'falcro';

const cache = {
  count: 0
};

// "declare" what the component wants
@connect({query: () => ['count']})
class Counter extends Component{

  onClick = () =>
    this.props.falcro.set('count', this.props.count + 1)

  render(){
    return <div onClick={this.onClick}>
      clicked {this.props.count} times
    </div>;
  }
}

// start it up
app({cache}, model =>
  render(<Provider model={model}>
    <Counter />
  </Provider>, document.getElementById('root')));
```

connect(options)
---

- `query` (function) - return an array of pathSets
- `params` - (object) - default parameters, which will be passed to `query`
- `prepare` - (function) - like relay's `prepareVariables`, gives the opportunity to transform params before being passed into thr query
- `fragments` - (object) - use this to define 'subqueries' that can be picked up by owners statically
- `actionsKey` - (string, default 'falcro') - prop name to use to pass on actions

statics
---

- `getQuery`
- `getParams`
- `getFragment(key)`

passed down in `props`
---

- `...value` - ie, the result of the query is spread into props
- `error` - if the fetch failed
- `params` - the params that were used for the query
- `loading` - true/false whether a fetch is in flight
- `falcro`
-- `.set(path, value)` - send a mutation to the model
-- `.refresh()` - triggers a fetch/sync
-- `.setParams(params, refresh = false)` - change the params for the current query, and optionally trigger a fetch



todo
---

*so much*

- chaining falcor datasources
- rendering *only* the components that change
- proper `.set`/`.call` hooks
- redux scenarios (rewind/replay/etc)
- streaming results
- 'idents'?
- derefs
- etc etc




