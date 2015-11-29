import React, {Component} from 'react';
import {render} from 'react-dom';
import {root, connect} from '../src';
import Router from 'falcor-router';
import request from 'superagent';
import ErrorD from './Error';
import Stringify from './Stringify';

// a 'service' that fetches user details from github
function user(id){
  // TODO - stream results
  // TODO - deal with errors
  return new Promise((resolve, reject) =>
    request.get(`https://api.github.com/users/${id}`).end((err, res) =>
      err ? reject(err) : resolve(res.body)));
}

// "remotes"
const source = new Router([{
  route: 'users[{keys:ids}]',
  get: async function (pathSet){
    let responses = await Promise.all(pathSet.ids.map(user));
      return pathSet.ids.map((id, i) =>
        ({path: ['users', id],  value: responses[i]}));
  }
}]);


@root({cache: {input: ''}, source})
@connect({
  params: { userId: 'octocat' },
  query: ({userId}) => [ `input`, `users['${userId}']['login', 'name', 'email', 'avatar_url']`]
})
class Search extends Component{
  onChange = e => {
    // sends a mutation
    this.props.falcro.set('input', e.target.value);

    // params are different from props
    // in that they're 'local' to the component
    // and only passed to the query fn
    // similar to om.next/set-params!
    this.props.falcro.setParams({
      userId: e.target.value
    }, true); // trigger a sync for dynamic data
  }
  render(){
    return <div>
      <input value={this.props.input} onChange={this.onChange} /> <br/>
      name: {this.props.params.userId} <br/>

      {/* spinner */ this.props.loading ? 'loading...' : <br/>}
      {/* data */ !this.props.loading ?
        <Stringify data={this.props.users}/> :
      null}

      <ErrorD error={this.props.error}/>
    </div>;
  }
}

// start it up
render(<Search />, document.getElementById('app'));
