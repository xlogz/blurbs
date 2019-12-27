var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', 
function(req, res) {
  res.render('index');
});


console.log('Bookmark is listening on 3000');
app.listen(3000);