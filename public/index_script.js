var localAudioMute = false;
var localVideoMute = false;
var sharingDisplay = false;
var chat = true;

var connection = new RTCMultiConnection();
connection.socketURL = 'https://muazkhan.com:9001/';

connection.session = {
    audio: true,
    video: true,
    data: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

connection.onmute = function(e) {
    if(e.type === 'local') {
        e.mediaElement.setAttribute('poster', 'nocam.jpg');
    }

    if(e.type === 'remote') {
        e.mediaElement.setAttribute('poster', 'nocam.jpg');
    }
}

var roomid = "";
var user = connection.userid;

function OnLoad() {
    var paramValue = window.location.href.split("?")[1].split("=")[1];
    if(paramValue == ''){
        roomid = connection.token();
        connection.openOrJoin(roomid);
    }
    else{
        roomid = paramValue;
        connection.openOrJoin(roomid);
    }

    document.getElementById('user-id').innerHTML = `Your id: ${connection.userid}`
}

var btnInvite = document.getElementById('btn-invite');

btnInvite.addEventListener("click", (e) => {
    prompt(
      "Copy this link and send it to people you want to meet with",
      window.location.href
    );
  });

var videoGrid = document.getElementById('video-grid');

connection.onstream = function(event) {
    var video = event.mediaElement;
    video.controls = false;
    videoGrid.appendChild(video);
};

var muteButton = document.getElementById('mute-button');

muteButton.addEventListener("click", () => {
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
        connection.streamEvents.selectFirst('local').mediaElement.muted=true;
        html = `<i class="fas fa-microphone"></i>`;
        muteButton.classList.toggle("background__red");
        muteButton.innerHTML = html;
    }
  });

var stopVideo = document.getElementById('stop-video');

stopVideo.addEventListener("click", () => {
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
        connection.streamEvents.selectFirst('local').mediaElement.muted=true;
        html = `<i class="fas fa-video"></i>`;
        stopVideo.classList.toggle("background__red");
        stopVideo.innerHTML = html;
    }
  });

var shareDisplay = document.getElementById('share-display');

shareDisplay.addEventListener("click", () => {

    if(!sharingDisplay){
        connection.replaceTrack({
            screen: true,
            oneway: true,
            data: true
        });
        shareDisplay.classList.toggle("background__gray");
        sharingDisplay = true;
    }
    else{
        connection.resetTrack();
        shareDisplay.classList.toggle("background__gray");
        sharingDisplay = false;
    }
});

var dropCall = document.getElementById('drop-call');

dropCall.addEventListener("click", () => {
    window.location.replace('/')
});

var showChat = document.getElementById('show-chat');

showChat.addEventListener("click", () => {
    if(chat == true){
      chat = new Boolean(false);
      document.querySelector(".main__right").style.display = "none";
      document.querySelector(".main__left").style.display = "flex";
      document.querySelector(".main__left").style.flex = 1;
    }
    else{
      chat = new Boolean(true);
      document.querySelector(".main__right").style.display = "flex";
      document.querySelector(".main__left").style.display = "flex";
      document.querySelector(".main__right").style.flex = 0.2;
      document.querySelector(".main__left").style.flex = 0.8;
    }
});

let send = document.getElementById("send");
let messageContainer = document.getElementById('main-chat-window');

send.addEventListener("click", (e) => {
    OnSendMessage();
});

function OnSendMessage() {
    let text = document.querySelector("#chat_message");

    if (text.value.length !== 0) {
        connection.session.data = true;
        connection.send(text.value);
    
        document.getElementById("messages").innerHTML =
        document.getElementById("messages").innerHTML +
        `<div class="message">
            <b><i class="far fa-user-circle"></i> <span> You</span> </b>
            <span>${text.value}</span>
        </div>`; // ty dyrak, kto prover9et ety raboty!!!
    
        messageContainer.scrollTop = messageContainer.scrollHeight;
        var element = $("#chat_message").emojioneArea();
        element[0].emojioneArea.setText('');
    }
}


connection.onmessage = function(event) {
    document.getElementById("messages").innerHTML =
    document.getElementById("messages").innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          event.userid === user ? "me" : event.userid
        }</span> </b>
        <span>${event.data}</span>
    </div>`;

    messageContainer.scrollTop = messageContainer.scrollHeight;
};