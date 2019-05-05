import help from '../common/help.js';

console.log('async引用', help.version);

const asyncTest = {
  init() {
    console.log('test, init')
  }
};

export default asyncTest;
