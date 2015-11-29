import React, {Component} from 'react';

export default class Stringify extends Component{
  render(){
    return <pre>{
      JSON.stringify(this.props.data, null, ' ')
    }</pre>;
  }
}
