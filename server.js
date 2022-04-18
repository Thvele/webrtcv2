const express = require('express');
const app = express();
const server = require('http').Server(app);

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('lobby');
});

app.get('/join_room', (req,res) => {
    res.render('index.ejs',{roomID: req.params})
});

server.listen(3000);