import React from 'react';
import {render} from 'react-dom';
import {Root, Get, Model, Router} from '../src';
import request from 'superagent';

// a 'service' that fetches user details from github
function user(id){
  // TODO - stream results
  // TODO - deal with errors
  return new Promise((resolve, reject) =>
    request.get(`https://api.github.com/users/${id}`).end((err, res) =>
      err ? reject(err) : resolve(res.body)));
}

// and another that gets repos for a user

// "remotes"
const source = new Router([{
  route: 'users[{keys:ids}]',
  get: async function (pathSet){
    let responses = await Promise.all(pathSet.ids.map(user));
      return pathSet.ids.map((id, i) =>
        ({path: ['users', id],  value: responses[i]}));
  }
}]);

let model = new Model({
  cache: {input: 'octocat'},
  source
});

export function App(){
  return <Root model={model}>
    <Search/>
  </Root>;
}

function Search(){
  return <Get query='input'>{
    ({input, $}) =>
      <div>
        <input value={input} onChange={e => $.setValue('input', e.target.value)}/>
        <Get query={`users.${input}['avatar_url', 'name']`}>{
          ({users, loading}) =>
            <div>
              {loading ? 'loading...' : null}
              <pre>{JSON.stringify(users)}</pre>
            </div>
        }</Get>
      </div>
  }</Get>;
}

// render(<App/>, document.getElementById('app'));

