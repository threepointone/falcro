import React from 'react';

export default function ErrorD({error}){
  return <div>
    {error ?
      <pre style={{color:'red'}}>
        {JSON.stringify(error.stack || error, null, ' ')}
      </pre> :
    null}
  </div>;
}
