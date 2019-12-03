var queryString = require('querystring');
function home(response) {
    console.log("Executing home");
    var htmlfile =

        '<!DOCTYPE html>' +
        '<html>' +
        '<body>' +

        '<form action="/review" method="post">' +
        '<textarea name="text" rows="20" cols="20"></textarea>' +
        '<br>' + '<br>' +
        '<input type="submit" value="Submit">' +
        '</form>' +

        '</body>' +
        '</html>';

    response.writeHead(200, { "Content-type": "text/html" });
    response.write(htmlfile);
    response.end();
}

function review(response, reviewData) {
    console.log("Executing review");
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write("Your review is : " + queryString.parse(reviewData).text);
    response.end();
}

exports.home = home;
exports.review = review;