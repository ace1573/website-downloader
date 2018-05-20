//封装为async方法
exports.wrap = function(onRequest){
  return function(request, response){
    onRequest(request, response)
    .then((res)=>{

    })
    .catch((err)=>{
      console.error(err)
    })
  }
}