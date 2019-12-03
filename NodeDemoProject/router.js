function route(handle, pathname, response, reviewData) {
    console.log("Routing requested for: " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, reviewData);
    } else {
        console.log("No handler for path :" + pathname);
        response.writeHead(404, { "Content-type": "text/plain" });
        response.write("Error: 404");
        response.end();
    }
}

exports.route = route;