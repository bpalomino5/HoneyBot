'use strict';

require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const BrandonID = process.env.BrandonID
const ElaineID = process.env.ElaineID


// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "honeyToken"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function searchNLP(nlp, name) {
  if (nlp.entities[name]){
    return nlp.entities[name][0];
  } else{
    // TODO: or remove
  }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
  // Check if the message contains text
  console.log(received_message);
  if (received_message.text) {
    let nlp = received_message.nlp;
    const intent = searchNLP(nlp, 'intent');
    const greetings = searchNLP(nlp, 'greetings');
    const person = searchNLP(nlp, 'person');
    const item = searchNLP(nlp, 'item');

    if (intent && intent.confidence > 0.8 && intent.value === 'notify'){
      if (item && item.confidence > 0.8){
        if (person && person.confidence > 0.8) {
          let message = '';
          if (item.value === 'food') message = "Honey I'm hungry buy me food";
          else if (item.value === 'money') message = "Honey I need money...";
          else if (item.value === 'love') message = 'I love you Honey!';

          if (sender_psid === BrandonID){ // send to Elaine
            sendTextMessage(BrandonID, "Got it, sending now");
            sendTextMessage(BrandonID, message);
          } else if (sender_psid === ElaineID){
            sendTextMessage(ElaineID, "Got it, sending now");
            sendTextMessage(BrandonID, message);
          } else {
            sendTextMessage(sender_psid, "Sorry, I don't know who to message.");
          }
        } else {
          sendTextMessage(sender_psid, "Sorry, I don't know who to message.");
        }
      } else {
        sendTextMessage(sender_psid, "Sorry, I don't know what you want.")
      }
    } else if (greetings && greetings.confidence > 0.8) {
      sendTextWithQuickReplies(sender_psid, "Hi, how can I help?")
    } else {
      sendTextMessage(sender_psid, "Sorry, I do not understand.")
    }
  }
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  // callSendAPI(sender_psid, response);
}

function sendTextWithQuickReplies(recipientID, messageText){
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      text: messageText,
      quick_replies: [
        {
          content_type: 'text',
          title: 'tell honey I want food',
          payload: 'greetingPayload'
        },
        {
          content_type: 'text',
          title: 'tell honey I need money',
          payload: 'greetingPayload'
        },
        {
          content_type: 'text',
          title: 'tell honey I love you',
          payload: 'greetingPayload'
        }
      ]
    }
  };

  callSendAPI(messageData)
}

function sendTextMessage(recipientID, messageText){
  var messageData = {
    recipient: {
      id: recipientID
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData)
}

// Sends response messages via the Send API
function callSendAPI(messageData) {
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": messageData
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent! ')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}