var http = require('http'),
    fs = require('fs');

http.createServer(function (req, res) {

    if (req.url.indexOf('.html') != -1||req.url=="/") { //req.url has the pathname, check if it conatins '.html'

        fs.readFile(__dirname + '/public/index.html', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
            console.log(req.url);
        });

    }else if (req.url.indexOf('.js') != -1) { //req.url has the pathname, check if it conatins '.js'
        if (req.url.indexOf('articleModel') != -1) {
            fs.readFile(__dirname + '/public/articleModel.js', function (err, data) {
                if (err) console.log(err);
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data);
                res.end();
            });
        }
        if (req.url.indexOf('localStorage') != -1) {
            fs.readFile(__dirname + '/public/localStorage.js', function (err, data) {
                if (err) console.log(err);
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data);
                res.end();
            });
        }
        if (req.url.indexOf('newsView') != -1) {
            fs.readFile(__dirname + '/public/newsView.js', function (err, data) {
                if (err) console.log(err);
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data);
                res.end();
            });
        }
        if (req.url.indexOf('clickFunctions') != -1) {
            fs.readFile(__dirname + '/public/clickFunctions.js', function (err, data) {
                if (err) console.log(err);
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data);
                res.end();
            });
        }
        if (req.url.indexOf('scripts') != -1) {
            fs.readFile(__dirname + '/public/scripts.js', function (err, data) {
                if (err) console.log(err);
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data);
                res.end();
            });
        }
    }else if (req.url.indexOf('.css') != -1) { //req.url has the pathname, check if it conatins '.css'

        fs.readFile(__dirname + '/public/styles.css', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });

    }else if(req.url=="/images/redactButton.png"){
        fs.readFile(__dirname + '/public/images/redactButton.png', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(data);
            res.end();
        });
    }else if(req.url=="/images/bucket.png"){
        fs.readFile(__dirname + '/public/images/bucket.png', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(data);
            res.end();
        });
    }else{
        res.writeHead(404,{'Content-Type': 'text/css'});
        res.write("404 Данная страница не найдена!");
        res.end();
    }
}).listen(3000);