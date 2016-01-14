import React from 'react';
import {render} from 'react-dom';
import {Root, Get, Model} from '../src';

let model = new Model({cache: {count: 0}});

function App(){
  return <Root model={model}>
    <Counter/>
  </Root>;
}

function Counter(){
  return <Get query='count'>{
    ({count, $}) =>
      <div onClick={() => $.setValue('count', count + 1)}>
        clicked {count} times
      </div>
  }</Get>;
}

render(<App/>, document.getElementById('app'));

