import ReactDOMServer from 'react-dom/server';

export async function renderToString(el, model){
  // start caching queries on the model
  model.startCaching();

  // we render to string once so the model gets primed with all the queries it would have received
  ReactDOMServer.renderToString(el);

  let queries = [...model.queries.values()];
  model.stopCaching();

  // then, we make a regular fetch to prime the model cache
  await model.get(...queries);

  // and finally render to string
  return ReactDOMServer.renderToString(el);
}
  // todo - recurse until queries doesn't change
