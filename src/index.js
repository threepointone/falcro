import {Component, PropTypes, Children, createElement} from 'react';
import {Model} from 'falcor';

function log(){
  console.log(this);
  return this;
}

function get(paths, {cached = true, done = () => {}} = {}){
  let value, error;
  (cached ? this.withoutDataSource() : this)
    .get(...paths)
    .subscribe(
      res => value = res,
      err => error = err,
      done /* noop*/);

  if (error){
    throw error;
  }
  return value ? value.json : {};
}

export function connect({
  query = () => [],
  fragments = {},
  params = {},
  actionsKey = 'falcro',
  prepare = x => x
}){

  return function(Target){
    return class Falcor extends Component{
      static displayName = `ƒ:${Target.displayName}`

      static contextTypes = {
        falcor: PropTypes.instanceOf(Model).isRequired
      }

      static getQuery(){
        return query;
      }

      static getFragment(key){
        return fragments(key);
      }

      static getDefaultParams(){
        return params;
      }

      // these 2 should be pulled out via an 'indexer' ala om next
      // else we won't have replay
      // for now though, could work
      state = {
        params: prepare(params),
        loading: false
      }

      // the next 3 are passed down in `props.<actionsKey>`

      set = (...args) => {
        // todo - .set instead of setValue?
        this.context.falcor.withoutDataSource().setValue(...args).subscribe(()=>{}, ::console.error, ()=>{});
      }

      setParams = (p, refresh = false) => {
        this.setState({params: {...this.state.params, ...p}}, () => {
          if (refresh){
            this.refresh();
          }
        });
      }

      refresh = () => {
        // funny thing here - race conditions don't really matter because we're pointing to ids
        this.setState({loading: true});
        // this should silently trigger the update
        this.context.falcor::get(query(prepare(this.state.params)), {
          cached: false,
          done: () => this.setState({loading: false})
        });

      }
      getValue(){
        try {
          return this.context.falcor::get(query(prepare(this.state.params)));
        }
        catch (error){
          return {error};
        }
      }

      actions = {
        set: this.set,
        refresh: this.refresh,
        setParams: this.setParams
      }

      render(){
        return createElement(Target, {
          ...this.props,
          ...this.getValue(),
          params: prepare(this.state.params),
          loading: this.state.loading,
          [actionsKey]: this.actions
        }, this.props.children);
      }
    };
  };
}


export class Provider extends Component{
  static propTypes = {
    model: PropTypes.instanceOf(Model).isRequired,
    children: PropTypes.element.isRequired
  }

  static childContextTypes = {
    falcor: PropTypes.instanceOf(Model).isRequired
  }

  getChildContext() {
    return { falcor: this.props.model };
  }

  render(){
    return Children.only(this.props.children);
  }
}

// this boilerplate needed to 'hoist' control to the top
export function app(options, then){
  if (typeof options === 'function'){
    return app({}, options);
  }
  // this weirdness because Model::onChange fires immediately *while* initializing
  // leaving model still undefined, however will try to trigger a render where you'll
  // have to pass it down... it's a mess
  // will think aof a better solution later, this is good for now
  let started = false, model;
  function onChange(){
    if (started){
      then(model);
    }
    started = true;
  }
  model = new Model({...options, onChange}).batch();
  onChange();
}




