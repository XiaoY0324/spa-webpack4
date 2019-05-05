import { sync } from './components/sync/' // 同步引用包
import(/* webpackChunkName: "async-test" */'./components/async/index.js').then(_ => { // 魔法注释 异步引用包 会被单独打包 不打到主包
  console.log(_);
  _.default.init();
});

console.log('hello');
sync();
