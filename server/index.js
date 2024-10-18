const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { log } = require("console");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //is basically telling our server which url or server is gonna be calling
    //and making the calls to our socket.io server ==> it is the react sever that is going to be running.
    //we connect our back to the front end

    methods: ["GET", "POST"], //which methods we accept
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`user with ID: ${socket.id} joined room: ${data}`);
  });
  //connecting to the room
  //listing to events
  socket.on("message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT || 4000, () => {
  console.log("SERVER RUNNING");
});
