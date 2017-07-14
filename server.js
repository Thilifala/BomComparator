//server端测试

const http = require('http');
const url = require('url');

let count = 0;
var server = http.createServer(function (req, res) {
    count += 1;
    let pathname = url.parse(req.url,true).path;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Request Success!'+'ReqCount:' + count + ',url:' + pathname);
}).listen(8888);

console.log('Server running at http://127.0.0.1:8888/');