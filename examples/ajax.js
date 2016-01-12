import React from 'react';
import {render} from 'react-dom';
import {Root, Get, Model, Router, routeByCollectionId} from '../src';

// a 'service' that fetches user details from github
const user = async id =>
  await (await fetch(`https://api.github.com/users/${id}`)).json();
// TODO - stream results

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
    ({input = 'octocat', $}) => <div>
      <input value={input} onChange={e => $.setValue('input', e.target.value)}/>
      <Get query={`users.${input}['avatar_url', 'name']`}>{
        ({users, loading}) => <div>
          {loading ? 'loading...' : null}
          <pre>{JSON.stringify(users)}</pre>
        </div>
      }</Get>
    </div>
  }</Get>;
}

render(<App/>, document.getElementById('app'));

