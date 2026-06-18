const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // tighten this to your frontend URL once deployed
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Client joins a room specific to one conversation
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Client sends a message; server broadcasts it to everyone in that room
  socket.on("sendMessage", (data) => {
    const { conversationId, message } = data;
    io.to(conversationId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});