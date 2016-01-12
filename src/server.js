import ReactDOMServer from 'react-dom/server';

export async function renderToString(el, model){
  // todo - recurse until queries doesn't change
  model.__caching__ = true;
  ReactDOMServer.renderToString(el);
  model.__caching__ = false;
  let q = [...model.queries.values()];
  model.queries = new Set();
  await model.get(...q);
  return ReactDOMServer.renderToString(el);
}
