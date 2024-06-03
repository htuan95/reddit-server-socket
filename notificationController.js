const Notification = require("./notificationModel");
const createError = require("http-errors");

// ---------------- GET ALL NOTIFICATIONS READ ----------------
const getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    await Notification.updateMany({ receiver: userId }, { read: true });

    const notifications = await Notification.find({ receiver: userId }).sort({
      createdAt: "desc",
    });
    const decodedNotifications = notifications.map((notification) => {
      const dataSender = JSON.parse(notification.sender);
      const dataPost = JSON.parse(notification.post ?? null);
      const { sender, post, ...rest } = notification.toObject();
      return {
        ...rest,
        sender: dataSender,
        post: dataPost,
      };
    });

    return res.status(200).json({
      message: "Get all notifications",
      notifications: decodedNotifications,
    });
  } catch (error) {
    return next(error);
  }
};

// ---------------- SET NOTIFICATION READ ----------------
const unReadNotification = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({
      receiver: userId,
      read: false,
    }).sort({
      createdAt: "desc",
    });

    return res
      .status(200)
      .json({ message: "Un read notifications", notifications });
  } catch (error) {
    return next(error);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const { type, sender, receiver, post, comment, read } = req.body;

    const notification = await Notification.create({
      sender,
      receiver,
      type,
      post,
      comment,
      read,
    });
    await notification.save();

    console.log(comment);

    return res.status(200).json({ message: true });
  } catch (error) {
    return next(error);
  }
};

const removeNotification = async (req, res, next) => {
  try {
    const { type, sender, receiver, comment, post } = req.body;

    await Notification.deleteOne({
      sender,
      receiver,
      type,
      comment,
      post,
    });

    return res.status(200).json({ message: true });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNotification,
  removeNotification,
  getAllNotifications,
  unReadNotification,
};
