const socket = io();

let username = '';

document.getElementById('joinBtn').addEventListener('click', () => {
    username = document.getElementById('username').value.trim();
    if (username) {
        document.getElementById('chat').style.display = 'block';
    }
});

document.getElementById('sendBtn').addEventListener('click', () => {
    const msg = document.getElementById('messageInput').value.trim();
    if (msg) {
        socket.emit('message', msg);
        document.getElementById('messageInput').value = '';
    }
});

socket.on('message', (data) => {
    const messagesDiv = document.getElementById('messages');
    const msg = document.createElement('div');
    msg.textContent = `[${data.time}] ${data.user}: ${data.msg}`;
    messagesDiv.appendChild(msg);
});