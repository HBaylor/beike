
const fs = require('fs')
const request = require('request')
const base = '../美女图'



// 使用解析出来的地址进行图片的下载
module.exports = function (folderName, title, list) {
  
  // 检查有没有最基础的目录
  !fs.existsSync(base) && fs.mkdirSync(base)

  list.forEach((item, index) => {
    const PATH = `${base}/${folderName}_${title}_${index}.jpg`
    if (!fs.existsSync(PATH)) {
      request(item).pipe(fs.createWriteStream(PATH))
      console.log(`${folderName}_${title}_${index}.jpg 写入成功！`)
    } else {
      console.log(`${folderName}_${title}_${index}.jpg 已存在！`)
    }
  })
}