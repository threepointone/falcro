/* global describe, it */

require('chai').should();

import {Root, Get, Model} from '../src';
import falcor from 'falcor';

function Counter(){
  return <Get query='count'>{
    ({count, $}) =>
      <div onClick={() => $.setValue('count', count + 1)}>
        clicked {count} times
      </div>
  }</Get>;
}


describe('falcro', () => {
  describe('Model', () => {
    it('is an instance of falcor.Model', () => {
      let m = new Model();
      m.should.be.an.instanceof(falcor.Model);
    });
  });

  describe('Root', () => {
    it('accepts a model');
  });

  describe('Get', () => {
    it('accepts a query');
  });
});
