var http = require('http');
var url = require('url');

function startserver(route, handle) {
    function onRequest(request, response) {
        var reviewData = '';
        var pathname = url.parse(request.url).pathname;
        console.log("inside module createServer");
        request.setEncoding("UTF8");

        request.addListener("data", function (ch) {
            reviewData += ch;
        });

        request.addListener("end", function () {
            route(handle, pathname, response, reviewData);

        })
        // response.writeHead(200, { "Content-type": "text" });
        // response.write("In Server");
        // response.end();
    }
    http.createServer(onRequest).listen(8888);
    console.log(" createServer on 8888");
}

exports.startserver = startserver;