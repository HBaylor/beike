const Koa = require('koa');
const app = new Koa();
const crawler = require('./crawler/index')

// 执行抓取
crawler()

app.listen(3000)