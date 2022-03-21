const http = require("http");
const { URL } = require('url');
const path = require("path");  
const fs = require("fs");
const axios = require('axios')

const websiteUrl = 'http://meridian-audio.com'

//启动http服务器
http.createServer(onRequest).listen(8888);
console.log("Server has started on 8888.");


//监听请求
function onRequest(request, response) {
    var urlObj = new URL(request.url, `http://${request.headers.host}`);

    var pathname = urlObj.pathname;

    if(pathname.endsWith('/')) pathname += 'index.html'
    //保存文件地址
    pathname = './download' + pathname

    console.log('visit-->', pathname)
    
    if(!fs.existsSync(pathname)){
      //请求
      axios.get(websiteUrl + request.url, {responseType: 'arraybuffer',})
      .then((res)=>{
        console.info('write-->', pathname)
        //创建文件夹
        let dir = path.dirname(pathname)
        mkdirsSync(dir)
        let fd = fs.openSync(pathname, 'a')
        fs.writeSync(fd, res.data)
        fs.closeSync(fd)

        //响应请求
        response.write(res.data)
        response.end()
      })
      .catch((err)=>{
        console.error(err)
      })
      
    }else{
      let data = fs.readFileSync(pathname)
      response.write(data)
      response.end()
    }

    
}



// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    fs.mkdirSync(dirname, { recursive: true })
  }
}



