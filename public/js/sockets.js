console.log("socket attempt")
//var origin = window.location.origin
const socket = io("http://localhost:3000");
console.log("socket attempt2")
socket.on('connect')
//socket.auth = "Josh Prasad"
//socket.connect()      default autoconnect is true
console.log(socket)
var chatButton = document.getElementById("chatButton")
console.log(chatButton)
document.getElementById("chatButton").addEventListener("click", messageSendHandler)

function messageSendHandler(e) {
    console.log("messageSendHandler")
    //e.preventDefault()
    console.log("messageSendHandler")
    let message = document.getElementById("messageInput").value
    console.log(message)
    socket.emit('message', message)
    messageInput.value = ''
}
socket.on('message', (msg) => {
    const item = document.createElement('li')
    item.textContent = msg
    document.getElementById("messages").appendChild(item)
})
    socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});