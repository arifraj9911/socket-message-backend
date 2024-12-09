const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const port = 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.send("Real Time World");
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("message", (msg) => {
    console.log(`message send from ${socket.id} and message = `, msg);
    const messageData = { text: msg, clientId: socket.id };
    console.log("message data", messageData);
    io.emit("message", messageData);
  });

  // handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Chat running on port ${port}`);
});

// app.listen(port, () => {
//   console.log(`Chat running on port ${port}`);
// });
