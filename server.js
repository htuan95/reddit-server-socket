require("./configs/db");
const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const createError = require("http-errors");
const { Server } = require("socket.io");
const { PORT, COR_OPTIONS, SOCKET_OPTIONS } = require("./configs");
const { socketHandler } = require("./socket");
const {
  getAllNotifications,
  unReadNotification,
  createNotification,
  removeNotification,
} = require("./notificationController");
const router = express.Router();

const port = PORT || 5000;
const app = express();
const httpServer = http.createServer(app);

// app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", CLIENT_URL);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes
router.get("/api/notifications/read/:userId", getAllNotifications);
router.get("/api/notifications/unread/:userId", unReadNotification);
router.post("/api/notifications", createNotification);
router.post("/api/notifications/delete", removeNotification);
app.use(router);

// middleware
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

httpServer.listen(port, () => console.log("Server is running on port " + port));

// socket io
const io = new Server(httpServer, SOCKET_OPTIONS);
socketHandler(io);
