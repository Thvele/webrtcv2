var connection = new RTCMultiConnection();
connection.socketURL = 'https://muazkhan.com:9001/';

var roomid = document.getElementById('input-roomid');
roomid.value = connection.token();

const enterRoom = document.getElementById("enter-room");

enterRoom.addEventListener("click", () => {
    document.getElementById('input-submit').click()
  });