const RequestPromise = require('request-promise')
const Request = require('request')
const cheerio = require('cheerio')
// const downloadImg = require('./downloadImg')
// const childProcess = require('child_process')
// const workerGetImagePath = childProcess.fork('./carwler/imagePath.js')
const url = 'https://www.ishsh.com'

const child_process = require('child_process')
const child = child_process.fork(`${__dirname}/two.js`,[], {})
child.on('message', (m) => {
  console.log('父进程收到消息', m);
});

// 使子进程打印: 子进程收到消息 { hello: 'world' }
child.send({ hello: 'world' });



let page = 1,
  type = 0,
  stop = 2,
  typeList = ['sexy', 'gaoqing', 'siwa', 'fengsu', 'model', 'star', 'qingchun', 'zipai']


// 解析第一层的地址和数量
const getOneceUrlList = function (bodyHtml) {
  const $ = cheerio.load(bodyHtml)
  let result = []
  const body = $('#post-list .post-thumbnail')
  body && body.each((i, el) => {
    const $ = cheerio.load(el)
    result.push({
      title: $('a').attr('title'),
      path: $('a').attr('href').split('.')[0].split('/')[1],
      num: Number($('.btns-sum span').text())
    })    
  })
  return result
}


// 解析第二层的地址和数量
const getImagePath = async function (obj) {
  const { num, path, title } = obj
  let promiseAry = []

  // 异步获取一张图片
  async function getOnePath(number) {
    const HTML = await RequestPromise(`${url}/${path}_${number}.html`)
    const $ = cheerio.load(HTML)
    return $('.picmainer .img_jz').find('a img').attr('src')
  }
  for (let i = 1; i <= num; i++) {
    promiseAry.push(getOnePath(i))
  }
  Promise.all(promiseAry).then(res => {
    downloadImg(title, path, res)
  }).catch(e => {
    console.log('error', num, path, title)
  }).finally(() => {
    next()
  })
}



function crawler (url) {
  try {
    Request(url, function (error, res, body) {
      let list = getOneceUrlList(body)
      if (res.statusCode == 404 || list.length == 0) {
        stop--
        console.log(stop, 'stop')
        // next()
        return
      }
      console.log(list)
      // workerGetImagePath.send('123')
      next()
      // list && list.forEach(item => {
      //   getImagePath(item)
      // })
    })
  }
  catch (e) {}
}

function next() {
  if (stop <= 0) {
    stop = 2
    page = 1
    type++
  } else page++

  if (type >= typeList.length) return
  console.log(`${url}/${typeList[type]}/page/${page}`)
  crawler(`${url}/${typeList[type]}/page/${page}`)
}

module.exports = next