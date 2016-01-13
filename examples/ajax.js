import React from 'react';
import {render} from 'react-dom';
import Router from 'falcor-router';
import {Root, Get, Model, routeByCollectionId} from '../src';
// import {renderToString} from '../src/server';

import 'isomorphic-fetch';

// a 'service' that fetches user details from github
const user = async id =>
  await (await fetch(`https://api.github.com/users/${id}`)).json();

const model = new Model({
  cache: {input: 'octocat'},
  source: new Router([
    routeByCollectionId('users', user)
  ])
});

export function App(){
  return <Root model={model}>
    <Search/>
  </Root>;
}

function Search(){
  return <Get query='input'>{
    ({input = 'octocat', $}) =>
      <div>
        <input value={input} onChange={e => $.setValue('input', e.target.value)}/>
        <Get query={`users.${input}['avatar_url', 'name']`}>{
          ({users, loading}) =>
            <div>
              {loading ? 'loading...' : null}
              <pre>{JSON.stringify(users, null, ' ')}</pre>
            </div>
        }</Get>
      </div>
  }</Get>;
}

render(<App/>, document.getElementById('app'));


// renderToString(<App/>, model).then(::console.log);


