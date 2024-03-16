import { io } from "socket.io-client"

const URL = "http://localhost:3000"
const socket = io(URL, {autoConnect: false})

console.log("hello")
alert("hello")

socket.onAny((event, ...args) => {
    console.log(event, args)
})

export default socket