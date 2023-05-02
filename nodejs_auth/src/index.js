const app = require("./app");
const socket = require("socket.io");
const { PORT } = process.env;
const { createNewChatRoom } = require("./domains/chat_room/controller")
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`Auth Backend running on port ${PORT}`);
  });
  const io = socket(server)

  io.on("connection", (socket) => {
    //when new user join room
    console.log("test")

    socket.on("createRoom", async ({ email1, email2 }) => {
      //* create user
      try {
        const room = await createNewChatRoom(email1, email2)
        console.log(socket.id, room);
        // socket.join(user.room);

        // //* emit message to user to welcome him/her
        // socket.emit("message", {
        //   userId: user.id,
        //   username: user.username,
        //   text: `Welcome ${user.username}`,
        // });

        // //* Broadcast message to everyone except user that he has joined
        // socket.broadcast.to(user.room).emit("message", {
        //   userId: user.id,
        //   username: user.username,
        //   text: `${user.username} has joined the chat`,
        // });
      }
      catch (e) {
        throw Error(e)
      }
    });

    socket.on('join room', (roomID) => {
      console.log(`User joined room ${roomID}`);
      socket.join(roomID);
    });

    socket.on('message', (message) => {
      console.log(socket.rooms)
      const roomID = Array.from(socket.rooms)[1];
      console.log(`Message received in room ${roomID}: ${message}`);
      io.to(roomID).emit('message', message);
    });

    // socket.on("joinRoom", ({ email, roomID}) => {
    //   //* create user
    //   const user = userJoin(socket.id, username, roomname);
    //   console.log(socket.id, "=id");
    //   socket.join(user.room);

    //   //* emit message to user to welcome him/her
    //   socket.emit("message", {
    //     userId: user.id,
    //     username: user.username,
    //     text: `Welcome ${user.username}`,
    //   });

    //   //* Broadcast message to everyone except user that he has joined
    //   socket.broadcast.to(user.room).emit("message", {
    //     userId: user.id,
    //     username: user.username,
    //     text: `${user.username} has joined the chat`,
    //   });
    // });


    // //when somebody send text
    // socket.on("chat", (text) => {
    //   //* get user room and emit message
    //   const user = getCurrentUser(socket.id);

    //   io.to(user.room).emit("message", {
    //     userId: user.id,
    //     username: user.username,
    //     text: text,
    //   });
    // });

    // Disconnect , when user leave room
    socket.on("disconnect", () => {
      // * delete user from users & emit that user has left the chat

    });
  });

};

startServer();
