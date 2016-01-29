var express = require('express');
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.json())

var links = [];

app.post('/api/v1/link', function(req, res) {
    var url = req.body.url;
    if (url) {
        links.push(url);
        res.send('OK');
    } else {
        res.status(500).send('Fail');
    }
});

app.get('/api/v1/links', function(req, res) {
    res.send(links);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});