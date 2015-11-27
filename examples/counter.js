// simplest get / set state example

import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import {app, connect, Provider} from '../src';
import {Model} from 'falcor';

// "declare" what the component wants
@connect({query: () => ['count']})
class Counter extends Component{
  // optional: add proptype checks on incoming props
  static propTypes = {
    count: PropTypes.number.isRequired,
    // you also recieve callbacks for sending mutations, etc
    falcro: PropTypes.object.isRequired
  }

  // send a mutation on click
  onClick = () => this.props.falcro.set('count', this.props.count + 1)

  render(){
    return <div onClick={this.onClick}>
      clicked {this.props.count} times
    </div>;
  }
}

class App extends Component{
  static propTypes = {
    // optional: ensure your app is recieving a valid model
    model: PropTypes.instanceOf(Model).isRequired
  }
  render(){
    // makes the falcor model available 'globally' via context
    return <Provider model={this.props.model}>
      <Counter />
    </Provider>;
  }
}

// start it up
app({cache: { count: 0 }},  // model options
  model =>  // render on every 'change'
    render(<App model={model}/>, document.getElementById('app')));


