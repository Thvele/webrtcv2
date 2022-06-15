// Объявление переменных
var localAudioMute = false;
var localVideoMute = false;
var sharingDisplay = false;
var mediaError = false;
var chat = true;

// Создание переменной, которая отвечает за передачу данных по сокетам
var connection = new RTCMultiConnection();
connection.socketURL = 'https://muazkhan.com:9001/';

// Установка первичных(дефолтных) значений для передачи данных
connection.session = {
    audio: true, // Передача звука с микрофона
    video: true, // Передача видео с видеокамеры
    data: true // Передача текста
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true, // Запрос на использование микрофона
    OfferToReceiveVideo: true // Запрос на использование камеры
};

// Объявление переменных, для хранения ID комнаты и пользователя
var roomid = "";
var user = connection.userid;

function OnLoad() { // Действия при загрузке страницы
    var paramValue = window.location.href.split("?")[1].split("=")[1];
    if (paramValue == '') {
        roomid = connection.token();
        connection.openOrJoin(roomid);
    }
    else {
        roomid = paramValue;
        connection.openOrJoin(roomid);
    }

    document.getElementById('user-id').innerHTML = `Ваш ID: ${connection.userid}`
}

var btnInvite = document.getElementById('btn-invite'); // Поиск элемента на странице по ID

btnInvite.addEventListener("click", (e) => { // Добавление собития при нажатии на элемент
    prompt(
        "Скопируйте эту ссылку и отправьте тому, кого хотите пригласить: ",
        window.location.href
    );
});

var videoGrid = document.getElementById('video-grid'); // Поиск элемента на странице по ID

connection.onstream = function (event) { // Создание элемента, в котором будет отображаться видео с камеры пользователя
    var video = event.mediaElement;
    video.controls = false;
    videoGrid.appendChild(video);
};

var muteButton = document.getElementById('mute-button'); // Поиск элемента на странице по ID

muteButton.addEventListener("click", () => { // Добавление собития при нажатии на элемент

    if (connection.attachStreams[0] !== undefined) {
        var localStream = connection.attachStreams[0];

        if (!localAudioMute) {
            localAudioMute = true;
            localStream.mute('audio');
            html = `<i class="fas fa-microphone-slash"></i>`;
            muteButton.classList.toggle("background__red");
            muteButton.innerHTML = html;
        } else {
            localAudioMute = false;
            localStream.unmute('audio');
            connection.streamEvents.selectFirst('local').mediaElement.muted = true;
            html = `<i class="fas fa-microphone"></i>`;
            muteButton.classList.toggle("background__red");
            muteButton.innerHTML = html;
        }
    }
});

var stopVideo = document.getElementById('stop-video'); // Поиск элемента на странице по ID

stopVideo.addEventListener("click", () => { // Добавление собития при нажатии на элемент

    if (connection.attachStreams[0] !== undefined) {
        var localStream = connection.attachStreams[0];

        if (!localVideoMute) {
            localVideoMute = true;
            localStream.mute('video');
            html = `<i class="fas fa-video-slash"></i>`;
            stopVideo.classList.toggle("background__red");
            stopVideo.innerHTML = html;
        } else {
            localVideoMute = false;
            localStream.unmute('video');
            connection.streamEvents.selectFirst('local').mediaElement.muted = true;
            html = `<i class="fas fa-video"></i>`;
            stopVideo.classList.toggle("background__red");
            stopVideo.innerHTML = html;
        }
    }
});

var shareDisplay = document.getElementById('share-display'); // Поиск элемента на странице по ID

shareDisplay.addEventListener("click", () => { // Добавление собития при нажатии на элемент

    if (!sharingDisplay) {

        connection.onMediaError = function (event) {
            window.location.reload()
        }

        connection.addStream({
            screen: true,
            oneway: true,
            data: true,
            streamCallback: function (stream) {
                shareDisplay.classList.toggle("background__gray");
                sharingDisplay = true;

                if (!stream) {
                    console.log('1231231')
                    shareDisplay.classList.toggle("background__gray");
                    sharingDisplay = false;
                }

                stream.getVideoTracks()[0].onended = function () {
                    shareDisplay.classList.toggle("background__gray");
                    sharingDisplay = false;
                };
            }
        });
    }
});


var dropCall = document.getElementById('drop-call'); // Поиск элемента на странице по ID

dropCall.addEventListener("click", () => { // Добавление собития при нажатии на элемент
    window.location.replace('/')
});

var showChat = document.getElementById('show-chat'); // Поиск элемента на странице по ID

showChat.addEventListener("click", () => { // Добавление собития при нажатии на элемент
    if (chat == true) {
        chat = new Boolean(false);
        document.querySelector(".main__right").style.display = "none";
        document.querySelector(".main__left").style.display = "flex";
        document.querySelector(".main__left").style.flex = 1;
    }
    else {
        chat = new Boolean(true);
        document.querySelector(".main__right").style.display = "flex";
        document.querySelector(".main__left").style.display = "flex";
        document.querySelector(".main__right").style.flex = 0.2;
        document.querySelector(".main__left").style.flex = 0.8;
    }
});

let send = document.getElementById("send"); // Поиск элемента на странице по ID
let messageContainer = document.getElementById('main-chat-window'); // Поиск элемента на странице по ID

send.addEventListener("click", (e) => { // Добавление собития при нажатии на элемент
    OnSendMessage();
});

function OnSendMessage() { // Функция отправки сообщения
    let text = document.querySelector("#chat_message");

    if (text.value.replace(/\s+/g,"").length !== 0) {
        connection.session.data = true;
        connection.send(text.value);

        document.getElementById("messages").innerHTML =
            document.getElementById("messages").innerHTML +
            `<div class="message">
            <b><i class="far fa-user-circle"></i> <span> You</span> </b>
            <span>${text.value}</span>
        </div>`;

        messageContainer.scrollTop = messageContainer.scrollHeight;
        var element = $("#chat_message").emojioneArea();
        element[0].emojioneArea.setText('');
    }
    else
    {
        var element = $("#chat_message").emojioneArea();
        element[0].emojioneArea.setText('');
    }
}


connection.onmessage = function (event) { // Функция отправки сообщения по подкоючению
    document.getElementById("messages").innerHTML =
        document.getElementById("messages").innerHTML +
        `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${event.userid === user ? "me" : event.userid
        }</span> </b>
        <span>${event.data}</span>
    </div>`;

    messageContainer.scrollTop = messageContainer.scrollHeight;
};