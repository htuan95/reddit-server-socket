require("dotenv").config();

const COR_OPTIONS = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  // origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};

const SOCKET_OPTIONS = {
  pingTimeout: 60000,
  cors: {
    // origin: process.env.CLIENT_URL,
  },
};

module.exports = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGO_URL: process.env.MONGO_URL,
  COR_OPTIONS,
  SOCKET_OPTIONS,
};
