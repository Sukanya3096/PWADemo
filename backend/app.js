const webPush = require("web-push");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server started on port 3000!");
});

const publicKey =
  "BAWGDOj01IxH9pReOD7CgnuAsPzjlylEIWIi7dSptrAQvTmBIKoJ1jWj_Wr5wJVIgj8XiwRfU8OJlRWscVhQ0g4";
const privateKey = "424987InmDxgK0pKUBZZ43U7J91uL7ih2b7-lbCnizY";

const sub = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/eJtGXQa4RPs:APA91bFi7XcIqk5EJdSmpw2tUYRGOHknBqiDO1qPoo63zfVTGLF_JsvuDuWsjlUiO_qqULGCNiDCyxe1DNkR-cesrSgezos7d0ynp8fH6JYYOz3N9kwB1dxZSj2SVB9Gy9scS4v-Y9-9",
  expirationTime: null,
  keys: {
    auth: "15UDkvXxHUaLNNsr_mTWog",
    p256dh:
      "BJoQF9ijFO8gOkOEx_Vamr2IbwuhPZ-338T6GPRDOpOikoi67INPvbRdrmgvQbK0PuLOD0Az8eCmHfYItuU0ZKE",
  },
};

webPush.setVapidDetails(
  "mailto: isukanyadutta@gmail.com",
  publicKey,
  privateKey
);

app.get("/", (req, res) => {
  res.send("<h1 style='text-align: center'>Welcome</h1>");
});

app.post("/data", (req, res) => {
  console.log("request came");
  const userData = req.body;
  console.log(JSON.stringify(userData));
  const notPayload = {
    notification: {
      data: { url: "https://www.google.com/" },
      icon: "https://icon-library.com/images/notifications-icon/notifications-icon-8.jpg",
      title: "demo form",
      body: "Message sent successfully",
      vibrate: [100, 50, 100],
    },
  };
  res.status(200).json(userData);
  webPush.sendNotification(sub, JSON.stringify(notPayload));
});

//console.log(webPush.generateVAPIDKeys());

// const payload = {
//   notification: {
//     data: { url: "https://www.google.com/" },
//     icon: "https://icon-library.com/images/notifications-icon/notifications-icon-8.jpg",
//     title: "demo form",
//     body: "New Notification",
//     vibrate: [100, 50, 100],
//   },
// };

// webPush.sendNotification(sub, JSON.stringify(payload));
