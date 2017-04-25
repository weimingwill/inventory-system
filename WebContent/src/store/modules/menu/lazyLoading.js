// lazy loading Components
// https://github.com/vuejs/vue-router/blob/dev/examples/lazy-loading/app.js#L8
// export default (name, index = false) => () => require.ensure([], (require) => require(`${name}${index ? '/index' : ''}.vue`), 'views')

export default (name, index = false) => () => require.ensure([], (require) => require(`../../../views/${name}${index ? '/index' : ''}.vue`))
// export default function lazyLoading(name, index = false) {
//   let filename = `${name}${index ? '/index' : ''}.vue`;
//   require.ensure([], function(require) {
//     // let foo = require('/views/')
//
//
//     // let foo = require(`${name}${index ? '/index' : ''}.vue`);
//     let foo = require('../../../views/' + filename);
//     console.log('foo');
//     console.log(foo);
//     return foo;
//   });
// }