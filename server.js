const express = require('express');
const app = express(); //Создание объекта для управления приложением
const server = require('http').Server(app); //Создание сервера

app.set('view engine', 'ejs') //Объявление используемого движка (шиюлонизатора) для визуализации страниц
app.use(express.static(__dirname + '/public')); //Объявление основной директории для контроллеров, таблиц стилей и др.

app.get('/', (req, res) => {
    res.render('lobby'); //Загрузка главной страницы
});

app.get('/join_room', (req,res) => {
    res.render('index.ejs',{roomID: req.params}) // Загрузка страницы звонка
});

server.listen(3000); // Запуск сервера на порте 3000