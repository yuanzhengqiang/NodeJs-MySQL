var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/files/'}).array('files'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.post('/127.0.0.1', function (req, res) {
   console.log(req);
   console.log(req.files[0]);  // 上传的文件信息
   
   var des_file = __dirname + "/" + req.files[0].originalname;
   
   fs.readFile( req.files[0].path, function (err, data) {
    var new_path = "\\files\\" + req.files[0].originalname;
      fs.rename(req.files[0].path,new_path,function(err){
        if(err) {
          console.error(err);
          return;
        }
        console.log("重命名成功:%s",req.files[0].originalname)
      })
        fs.writeFile(des_file, data, function (err) {
          
         if( err ){
              console.log( err );
         }else{
         	res.writeHead(200,{'Content-Type':"text/html;charset=utf-8"});
              response = {
                   消息状态:'文件上传成功', 
                   文件名:req.files[0].originalname,
                   文件路径:new_path
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
})
var server = app.listen(8868, function () {

  var host = "127.0.0.1"
  var port = server.address().port
  var html = "index.htm"

  console.log("应用实例，访问地址为 http://%s:%s/%s", host, port,html)

})