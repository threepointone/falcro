import React, {Component, PropTypes} from 'react';

export default class ErrorD extends Component{
  static propTypes = {
    // error: PropTypes.object
  }
  render(){
    let {error} = this.props;
    return <div>
      {error ?
        <pre style={{color:'red'}}>
          {JSON.stringify(error.stack || error, null, ' ')}
        </pre> :
      null}
    </div>;
  }
}
