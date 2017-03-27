var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/hello', function(req, res){
    res.send('hello world');
});

app.listen(3000);
