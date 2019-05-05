import lodash from 'lodash-es'; // lodash-es 可以{ xxx }导入某个单包
import item from "./sync.css"; // 想当成css模块解析 访问其下的属性 必须配置css-loader的module属性

console.log(item);
const sync = function () {
    console.log('sync');
    fetch('/api/test')
      .then(res => res.json())
      .then(data => {
          console.log('mock data~~~~~', data.message)
      })
    // document.getElementById("app").innerHTML = `<h1 class="${item.test}">hello h1<h1/>`;
};

const isArray = function (args) {
    console.log(lodash.isArray(args));
};

export {
    sync,
    isArray
}
