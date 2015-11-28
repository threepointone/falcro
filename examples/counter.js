// simplest get / set state example

import React, {Component} from 'react';
import {render} from 'react-dom';
import {root, connect} from '../src';

@root({
  cache: { count: 0 }
})
@connect({
  query: () => ['count']
})
class Counter extends Component{
  onClick = () => // send a mutation on click
    this.props.falcro.set('count', this.props.count + 1)
  render(){
    return <div onClick={this.onClick}>
      clicked {this.props.count} times
    </div>;
  }
}

render(<Counter/>, document.getElementById('app'));
