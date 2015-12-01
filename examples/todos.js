import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import Router from 'falcor-router';
import {root, connect} from '../src';
import ErrorD from './Error';
// import Stringify from './Stringify';

function log(){
  console.log(this);
  return this;
}


const TODOS = [
  {id: 0, text: 'haircut', done: true},
  {id: 1, text: 'shave', done: true},
  {id: 2, text: 'job', done: false}
];

function getTodos(type){
  return type === 'all' ? TODOS :
    type === 'completed' ? TODOS.filter(x => !!x.done) :
    TODOS.filter(x => !x.done);
}

function getById(id){
  return TODOS.filter(x=> x.id === id)[0];
}

function omap(fn){
  return Object.keys(this || {}).map(key => fn(this[key], parseInt(key, 10)));
}

function pad(n){
  if (this.length === n){
    return this;
  }
  return [...this, {$type: 'atom'}]::pad(n);
}

const getId = (() => {
  let ctr = 2;
  return () => {
    return ++ctr;
  };
})();

@root({
  cache: {
    input: ''
  },
  source: new Router([{
    route: 'todos[{keys:types}].length',
    get(pathSet){
      return pathSet.types.map(type => ({path: ['todos', type, 'length'], value: getTodos(type).length}));
    }
  },{
    route: 'todos[{keys:types}][{ranges:r}]',
    get(pathSet){
      let arrs =  pathSet.types.map(type =>
        getTodos(type).map(x => ({$type:'ref', value: ['byId', x.id]}))::pad(pathSet.r[0].to - pathSet.r[0].from + 1));

      return pathSet.types.map((type, i) =>
        arrs[i].map((x, ii) => ({path: ['todos', type, ii], value: x})))[0];
    }
  },{
    route: 'byId[{integers:ids}]',
    get(pathSet){
      let found = pathSet.ids.map(getById);
      return found.map(todo => ({path: ['byId', todo.id], value: todo}));
    }
  },{
    route: 'todos.add',
    call(path, args){

      let newId = getId();
      let todo = {id: newId, text: args[0], done: false};
      TODOS.push(todo);
      return [{path: ['todos', ['all', 'completed', 'active'], newId], value: {$type: 'ref', value: ['byId', newId]}}];
    }
  }])
})
@connect({
  params: {selected: 'all'},
  query: params => [`input`, `todos.${params.selected}[0..10]${Item.query}`]
})
class App extends Component{
  static defaultProps = {
    todos: { all: [] }
  }
  componentDidMount(){
    this.props.falcro.refresh();
  }
  onKeyDown = e => {

    let value = this.props.input;
    if (e.keyCode === 13 && value.length > 2){
      this.props.falcro.fn(['todos', 'add'], [value]);
    }

  }
  onChange = e => {
    this.props.falcro.set('input', e.target.value);
  }
  onRemove = id => {
    this.props.falcro.call('remove', id);
  }
  onToggle = id => {

  }
  select = type => {
    this.props.falcro.setParams({selected: type}, true);
  }
  clearCompleted = () => {
    this.props.falcro.call('clear');
  }

  render(){
    return <div>
      <input
        placeholder='what needs to be done?'
        value={this.props.input}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />
      <div> {/* todos */}
        {this.props.todos[this.props.params.selected]::omap(todo =>
          <Item key={todo.id} todo={todo} onRemove={this.onRemove} toggle={this.onToggle}/>
        )}
      </div>
      <Footer todos={this.props.todos} onSelect={this.select} onClear={this.clearCompleted}/>
      <ErrorD error={this.props.error}/>
    </div>;
  }
}

class Item extends Component{
  static query = `['done', 'text', 'id']`
  onRemove = () => this.props.onRemove(this.props.todo.id)
  toggle = () => this.props.toggle(this.props.todo.id)
  render(){
    let {done, text} = this.props.todo;
    return  <div>
      <input type='checkbox' checked={!!done} onChange={this.toggle}/>
      <span style={{textDecoration: done ? 'line-through' : 'none'}}>{text}</span>
      <span onClick={this.onRemove}>×</span>
    </div>;
  }
}

class Footer extends Component{
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired
  }

  render(){
    let {todos, onSelect, onClear} = this.props;
    return <div> {/* footer */}
      <div>{todos.length} items left</div>
      <div>
        <span onClick={() => onSelect('all')}>All</span>
        <span onClick={() => onSelect('completed')}>Completed</span>
        <span onClick={() => onSelect('active')}>Active</span>
      </div>
      <div onClick={onClear}>clear completed</div>
    </div>;
  }
}


render(<App/>, document.getElementById('app'));
