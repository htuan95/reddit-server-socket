let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected to socket.io`);
    // set up
    socket.on("addUser", ({ userId }) => {
      addUser(userId, socket.id);
      socket.join(userId); // add every user to new room
    });

    // send notification
    socket.on("send-notifications", (data) => {
      let receiverUser = getUser(data.receiver);
      console.log(receiverUser)
      socket.to(receiverUser?.socketId).emit("get-notifications", data);
    });

    // disconnected
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected...`);
      removeUser(socket.id);
    });
  });
};

module.exports = { socketHandler };
