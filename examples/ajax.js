import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {app, connect, Provider} from '../src';
import Router from 'falcor-router';
import request from 'superagent';

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

class App extends Component{
  render(){
    return <Provider model={this.props.model}>
      <Search />
    </Provider>;
  }
}

@connect({
  params: { userId: 'octocat' },
  query: ({userId}) => [ `input`, `users['${userId}']['login', 'name', 'email', 'avatar_url']`]})
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
      {/* data */ !this.props.loading ? <pre>{
        JSON.stringify(this.props.users, null, ' ')
      }</pre> : null}


      {this.props.error ?
        <pre style={{color:'red'}}>{JSON.stringify(this.props.error.stack || this.props.error)}</pre> :
        null}

    </div>;
  }
}

// start it up
app({cache: {input: ''}, source},
  model => ReactDOM.render(<App model={model}/>, document.getElementById('app')));
