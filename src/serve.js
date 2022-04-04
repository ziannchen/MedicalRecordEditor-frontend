var express = require('express');
var app = express();
var bodyParse = require('body-parser')
var config = require('../config/mysql-config');
console.log(config.ConnectionConfig);
//增加头部信息解决跨域问题
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");//允许源访问，本利前端访问路径为“http://localhost:8080”
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", ' 3.2.1');
    next();
});

//使用bodyParse解释前端提交数据
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

var mysql = require('mysql');
var connection = mysql.createConnection(config.ConnectionConfig);

connection.connect();

// 处理根目录的get请求
app.get('/', function (req, res) {
    console.log("received request for patient info");

    connection.query('SELECT first, second, name from department', function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        res.json(result);
    });
});

// 处理根目录的get请求
app.get('/downloadNotesA', function (req, res) {

    connection.query('SELECT id, note from medical_notes_a', function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        res.json(result);
    });
});

app.post('/uploadNotesA', function (req, res) {
    console.log("received request for patient info");

    connection.query('SELECT first, second, name from department', function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }

        res.json(result);
    });
});
// 监听3000端口
app.listen(3000);

console.log("服务器已运行");
console.log("监听网址为:http://127.0.0.1:3000/");