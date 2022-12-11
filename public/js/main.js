const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

const socket = io();

socket.emit('joinRoom', {username, room})
socket.on('roomUsers', ({ room, users}) => {
    showRoomName(room);
    showUsers(users);
})

socket.on('message', message => {
    showMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    // Emit message to server
    socket.emit('chatMessage',msg)

    //Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

function showMessage(message){
    const newDiv = document.createElement('div')
    
    newDiv.classList.add('message')
    newDiv.innerHTML = 
    `
    <p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `
    const chatContainer = document.querySelector('.chat-messages')
    chatContainer.appendChild(newDiv)
}

function showRoomName(room){
    roomName.innerText = room
}

function showUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}