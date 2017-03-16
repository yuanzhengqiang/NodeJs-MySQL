var http = require('http');
var fs = require('fs');
var express = require('express');                                                                                                                                                                                                                                           
var server = http.createServer(function(req,res){
	req.on('data', function(data){
		console.log("服务器接收到的数据: " + decodeURIComponent(data));
	});
	req.on('end', function(data){
		console.log("客户端请求数据全部接收完毕");
	});
	res.end();
}).listen(9993,"127.0.0.1",function(){
	console.log(decodeURIComponent(data));
});
