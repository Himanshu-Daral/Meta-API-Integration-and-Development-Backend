const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const PAGE_ACCESS_TOKEN =
  "EAAO1cePA2SEBO2yVVkUIxq6JJWcJ7lmuNIhonRbm3nKAF9wmBZCPAON6ZAZBKMTqAQXMx3i9hwo8KdgmheC7FaIXaNaO7cCT5bPvl4tzL3ZB4bFmh6QgEpI6YZBPwGCoJ2vFYmERorwftwTWYD7LBXiq3OZBLlImkpsyZA9beZBEoci1Jsk9EfLN1LiCmdZCrxqEaP0uDtZBM4kkTv1LVCVOmvCxwZD";
const VERIFY_TOKEN = "1043925687130401|zaYoDX06Wq-qIhnEordstQ7xAwI";

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.send({ status: true });
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook event handling
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      const senderId = webhookEvent.sender.id;
      if (webhookEvent.message) {
        sendMessage(senderId, "Hello from your bot!");
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});


// Function to send message
function sendMessage(recipientId, text) {
  axios
    .post(
      `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        recipient: { id: recipientId },
        message: { text },
      }
    )
    .then((response) => {
      console.log("Message sent:", response.data);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}


// API to Get Page Access Token
app.get("/get-access-token", (req, res) => {
    return res.send({ 
        status: true,
        'PageAccessToken' : PAGE_ACCESS_TOKEN
    });
  });



let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=1043925687130401&client_secret=797008720f5ae1c7c14552427737b129&fb_exchange_token=${PAGE_ACCESS_TOKEN}`,
  headers: {},
};

// async function makeRequest() {
//   try {
//     const response = await axios.request(config);
//     console.log(JSON.stringify(response.data));
//   } catch (error) {
//     console.log(error);
//   }
// }

// makeRequest();


// let participants = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: `https://graph.facebook.com/v20.0/me/conversations?fields=participants&access_token=${PAGE_ACCESS_TOKEN}`,
//   headers: { }
// };

// async function makeParticipants() {
//   try {
//     const response = await axios.request(participants);
//     response.data.data.map((elem,index) => {
//       if(elem.participants){
//         // console.log(`Participant ${index+1}: ${elem.participants.data[0].id}`);
//         console.log(`https://graph.facebook.com/v20.0/${elem.participants.data[0].id}?access_token=${PAGE_ACCESS_TOKEN}`);
//         let config = {
//           method: 'get',
//           maxBodyLength: Infinity,
//           url: `https://graph.facebook.com/v20.0/${elem.participants.data[0].id}?access_token=${PAGE_ACCESS_TOKEN}`,
//           headers: { }
//         };
        
//         async function makeProfile() {
//           try {
//             const response = await axios.request(config);
//             console.log(JSON.stringify(response.data));
//           }
//           catch (error) {
//             console.log(error);
//           }
//         }
        
//         // makeProfile();
//       }
//     })
//     // console.log(JSON.stringify(response.data));
//   }
//   catch (error) {
//     console.log(error);
//   }
// }

// makeParticipants();



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
