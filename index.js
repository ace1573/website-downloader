const http = require("http");
const https = require("https");
const url = require("url");
const path = require("path");  
const fs = require("fs");
const axios = require('axios')

const websiteUrl = 'https://baidu.com'

//启动http服务器
http.createServer(onRequest).listen(8888);
console.log("Server has started on 8888.");

//监听请求
function onRequest(request, response) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;

    if(pathname.endsWith('/')) pathname += 'index.html'
    //保存文件地址
    pathname = './download' + pathname

    console.log(pathname)
    
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



// 递归创建目录 异步方法  
function mkdirs(dirname, callback) {  
  fs.exists(dirname, function (exists) {  
      if (exists) {  
          callback();  
      } else {  
          // console.log(path.dirname(dirname));  
          mkdirs(path.dirname(dirname), function () {  
              fs.mkdir(dirname, callback);  
              console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
          });  
      }  
  });  
}  
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}



