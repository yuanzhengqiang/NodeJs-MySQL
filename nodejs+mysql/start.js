var http = require('http');
var querystring = require('querystring');
var util = require('util');
var mysql = require('mysql').createConnection({
	host:'localhost',
	user:'root',
	port: '3306',
	password:'yuanzhengqiang',
	database:'nodejs'
});
var personaldata = "";
//post = querystring.parse(post);
//personaldata = JSON.stringify(post);
http.createServer(function(req, res){
    var post = "";     //定义了一个post变量，用于暂存请求体的信息
    var dataInfo="";
    var dataCount = "";
    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8','Access-Control-Allow-Origin': '*'});
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post = decodeURI(chunk);
    });
	
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    	console.log("post参数:"+post);
	    post = querystring.parse(post);
	    if(post.Type == "edit"){//------------------------------编辑
	    	var sql = "update exercise set NAME='"+post.name+"',AGE='"+post.age+"',GENDER='"+post.gender+"',TEL='"+post.tel+"' where ID="+post.id;
	    	console.log("编辑;"+sql);
			dataInfo = updateData(sql,function(data){
			    console.log("返回值:"+data);
			    res.end(data);
			});
	    }else if(post.Type == "add"){//-------------------------新增
	    	var sql = "insert into exercise set NAME='"+post.name+"',AGE='"+post.age+"',GENDER='"+post.gender+"',TEL='"+post.tel+"'";
	    	console.log("新增:"+sql);
			dataInfo = insertData(sql,function(data){
			    console.log("返回值:"+data);
			    res.end(data);
			});
	    }else if(post.Type == "query"){//-----------------------查询
	    	var queryInfo = "";
	    	var sql = "";
	    	var sqlCount = "";
	    	var pagenumber = post.pagenumber;
	    	var pagesize = post.pagesize;
	    	if(post.name != "all"){
	    		queryInfo += " NAME LIKE '%"+post.name+"%'and"
	    	}
	    	if(post.age != "all"){
	    		queryInfo += " AGE LIKE '%"+post.age+"%'and"
	    	}
	    	if(post.gender != "all"){
	    		queryInfo += " GENDER LIKE '%"+post.gender+"%'and"
	    	}
	    	if(post.tel != "all"){
	    		queryInfo += " TEL LIKE '%"+post.tel+"%'and"
	    	}

	    	if(queryInfo != ""){
	    		queryInfo = queryInfo.substring(0, queryInfo.length - 3);
	    		sqlCount = "select count(*) from exercise WHERE" + queryInfo;
	    		if(pagenumber != "1" || pagesize != "10"){
	    			queryInfo += " LIMIT " + ((pagenumber - 1) * pagesize) + "," + pagesize;
	    		}else{
	    			queryInfo += " LIMIT 0,10";
	    		}
	    		sql = "select * from exercise WHERE" + queryInfo; 
	    		
	    	}else{
	    		if(pagenumber != "1" || pagesize != "10"){
	    			sql = "select * from exercise LIMIT " + ((pagenumber - 1) * pagesize) + "," + pagesize;
	    		}else{
	    			sql = "select * from exercise LIMIT 0,10";
	    		}
	    		
	    		sqlCount = "select count(*) from exercise";
	    	}

	    	var page = "{\"pagenumber\":\"" + pagenumber + "\",";
			page += "\"pagesize\":\"" + pagesize + "\",";

	    	//查询数据总条数
	    	console.log("查询数据总条数条件:" + sqlCount);
	    	var count = getCount(sqlCount,function(data){
			    dataCount =  data;
			});
			
			//查询数据
			console.log("查询条件:" + sql);
			dataInfo = getData(sql,function(data){
				console.log("数据总条数：" + dataCount);
			    var pageCount = Math.ceil(dataCount/pagesize);
			    console.log("数据总页数：" + pageCount);
				page += "\"pageCount\":\"" + pageCount + "\",";
				page += "\"recordCount\":\"" + dataCount + "\"}";
				var pageData = "\"page\":" + page;
				console.log("返回值:"+ data + "," + pageData + "}");
			    res.end(data + "," + pageData + "}");
			});
	    }else if(post.Type == "del"){//-------------------------删除
	    	var delId = post.id.split(",");
	    	for (var i = 0; i < delId.length; i++) {
	    		var sql = "delete from exercise where ID="+delId[i];
		    	console.log("删除:"+sql);
				dataInfo = deleteData(sql,function(data){
				    console.log("返回值:"+data);
				    res.end(data);
				});
	    	}
	    	
	    }
    });
}).listen(8880,function () {
    console.log("listen on port 8880");
});

//新增
var insertData = function(sql,callback){
	var msg = "";
	var data = "";
	mysql.query(sql,function(error,results){
		if(error){
			console.log('数据库读取错误:' + error.message);
			mysql.end();
			msg = "error";
			return;
		}else{
			console.log("新增成功");
			msg = "success";
		}
		data += "{\"msg\":\"" + msg + "\"}";
		callback(data);
	});
	return data;
};

//查询
var getData = function(sql,callback){
	var msg = "";
	var list = "";
	var infoList = "";
	var data = "";
	var dataInfo = "";
	mysql.query(sql, function(error, results, fields){
		if(error){
			console.log("数据库查询失败:" + error.message);
			mysql.end();
			msg = "error";
			return;
		}
		for(var i = 0; i < results.length; i++){
			infoList += "{\"id\":\"" + results[i]['ID'] + "\",";
			infoList += "\"age\":\"" + results[i]['AGE'] + "\",";
			infoList += "\"name\":\"" + results[i]['NAME'] + "\",";
			infoList += "\"gender\":\"" + results[i]['GENDER'] + "\",";
			infoList += "\"tel\":\"" + results[i]['TEL'] + "\"}";
		}
		//var sum = results.length;
		if(infoList != ""){
			list += "[" + infoList.replace(/}{/g, "},{") + "]";
		}else{
			list += "[]";
		}
		msg += "success";
		data += "{\"msg\":\"" + msg + "\",";
		data += "\"list\":" + list + "";
		callback(data);
	});
	return data;
};

//查询总条数
var getCount = function(sql,callback){
	var count = "";
	var data = "";
	mysql.query(sql, function(error, results, fields){
		if(error){
			console.log("数据库查询失败:" + error.message);
			mysql.end();
			return;
		}
		console.log("查询到的总条数：" + JSON.stringify(results));
		count = JSON.stringify(results).replace("[{","").replace("}]","").replace("(*)","");
		count = count.split(":")[1];
		data =  count;
		callback(data);
	});
	return data;
};

//修改
var updateData = function(sql,callback){
	var msg = "";
	var data = "";
	mysql.query(sql,function(error,results){
		if(error){
			console.log('数据库修改失败:' + error.message);
			mysql.end();
			msg = "error";
			return;
		}else{
			console.log("修改成功");
			msg = "success";
		}
		data += "{\"msg\":\"" + msg + "\"}";
		callback(data);
	});
	return data;
};

//删除
var deleteData = function(sql,callback){
	var msg = "";
	var data = "";
	mysql.query(sql,function(error,results){
		if(error){
			console.log("数据库删除失败:" + error.message);
			mysql.end();
			msg = "error";
			return;
		}else{
			console.log("删除成功");
			msg = "success";
		}
		data += "{\"msg\":\"" + msg + "\"}";
		callback(data);
	});
	return data;
};