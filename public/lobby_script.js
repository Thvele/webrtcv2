var connection = new RTCMultiConnection(); // Создание переменной, которая отвечает за передачу данных по сокетам
connection.socketURL = 'https://muazkhan.com:9001/';

var roomid = document.getElementById('input-roomid'); // Поиск элемента на странице по ID
roomid.value = connection.token(); // Добавление значения в текстовое поле

const enterRoom = document.getElementById("enter-room");  // Поиск элемента на странице по ID

enterRoom.addEventListener("click", () => { // Добавление собития при нажатии на элемент
    document.getElementById('input-submit').click()
  });