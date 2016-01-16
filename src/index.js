import {Component, PropTypes} from 'react';
import falcor from 'falcor';

function log(msg = this){
  console.log(msg);
  return this;
}

// synchronous `get` operation on a model (bypasses datasources)
// `let response = model::get(paths);`
// throws on error
function get(paths){
  paths = paths.filter(p => p.trim());

  let value, error;
  this.withoutDataSource()
    .get(...paths)
    .subscribe(
      res => value = res.json,
      err => error = err,
      () => {} /* noop*/);

  if (error){
    throw error;
  }
  return value;
}

// asynchronous get on the model
// accepts a callback
function aget(paths, done){
  paths = paths.filter(p => p.trim());

  let value, error;
  this.get(...paths)
    .subscribe(
      res => value = res.json,
      err => error = err,
      () => done(error, value) /* noop*/);
}


// 'Get' as a component
export class Get extends Component{
  static propTypes = {
    query: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired
  };
  static defaultProps = {
    select: x => x
  };

  static contextTypes = {
    falcor: PropTypes.instanceOf(falcor.Model).isRequired,
    ƒregister: PropTypes.func,
    ƒunregister: PropTypes.func
  };

  // these 2 should be pulled out via an 'indexer' ala om next
  // else we won't have replay
  // for now though, could work
  state = {
    loading: false
  };

  // the next 3 are passed down in `$`

  setValue = (path, value, remote = false) => {
    // todo - .set instead of setValue?
    let f = remote ? this.context.falcor : this.context.falcor.withoutDataSource();
    f.setValue(path, value).subscribe(()=>{}, ::console.error, ()=>{});
  };
  call = (path, args, refPaths = [], thisPaths = [], refresh = true) => {
    this.context.falcor.call(path, args, refPaths, thisPaths).subscribe(()=>refresh ? this.refresh() : null, ::console.error, ()=>{});
  };


  refresh = (props = this.props) => {
    // funny thing here - race conditions don't really matter because we're pointing to ids
    this.setState({loading: true});
    // this should silently trigger the update
    this.context.falcor::aget([props.query], () => this.setState({loading: false}));

  };
  componentWillMount(){
    this.context.ƒregister(this);
  }
  componentWillUnmount(){
    this.context.ƒunregister(this);
  }
  componentDidMount(){
    this.refresh();
  }
  componentWillReceiveProps(next){
    this.refresh(next);
  }
  getValue(){
    try {
      this.context.falcor.cacheQuery(this.props.query);
      return this.props.select(this.context.falcor::get([this.props.query]));
    }
    catch (error){
      return {error};
    }
  }

  actions = {
    setValue: this.setValue,
    refresh: this.refresh,
    call: this.call
  };

  render(){
    return this.props.children({
      ...this.getValue(),
      loading: this.state.loading,
      $: this.actions
    });
  }
}


export class Root extends Component{
  static propTypes = {
    model: PropTypes.instanceOf(falcor.Model).isRequired
  };
  static childContextTypes = {
    falcor: PropTypes.instanceOf(falcor.Model).isRequired,
    ƒregister: PropTypes.func,
    ƒunregister: PropTypes.func
  };

  getChildContext() {
    return {
      falcor: this.props.model,
      ƒregister: this.register,
      ƒunregister: this.unregister
    };
  }
  componentDidMount(){
    this.modelChange$ = this.props.model.listen(() =>
      this.components.forEach(c => c.refresh())
    );
  }
  componentWillUnmount(){
    this.modelChange$.dispose();
    delete this.modelChange;
  }
  components = [];
  register = c => {
    this.components.push(c);
  };
  unregister = c => {
    this.components = this.components.filter(x => x !== c);
  };
  render(){
    return this.props.children;
  }
}


export class Model extends falcor.Model{
  handlers = [];
  queries = new Set();
  __caching__ = false;
  constructor(options = {}){
    // this weird bit because onChange fires synchronously once inside the constructor
    // we discard the first event, and expose .listen to get back some sanity
    let _change = options.onChange || (() => {});
    let _started = false;
    super({...options, onChange: (...args) => {
      if (_started){
        _change(...args);
        this.handlers.forEach(h => h(...args));
      }
      _started = true;
    }});
  }
  startCaching(){
    this.__caching__ = true;
  }
  stopCaching(){
    this.__caching__ = false;
    this.queries = new Set();
  }
  cacheQuery(q){
    if (this.__caching__){
      this.queries.add(q);
    }
  }

  listen(fn){
    this.handlers.push(fn);
    return {dispose: ()=> this.handlers = this.handlers.filter(fn)};
  }
}

export function routeByCollectionId(key, fetch){
  return {
    route:`${key}[{keys:ids}]`,
    get: async function (pathSet){
      let responses = await Promise.all(pathSet.ids.map(fetch));
      return pathSet.ids.map((id, i) =>
          ({path: [key, id],  value: responses[i]}));
    }
  };
}
