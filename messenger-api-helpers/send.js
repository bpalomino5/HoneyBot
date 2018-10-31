// ===== LODASH ================================================================
import castArray from 'lodash/castArray';

// ===== MESSENGER =============================================================
import api from './api';
import messages from './messages';
import logger from './fba-logging';

// Turns typing indicator on.
const typingOn = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on', // eslint-disable-line camelcase
  };
};

// Turns typing indicator off.
const typingOff = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off', // eslint-disable-line camelcase
  };
};

// Wraps a message JSON object with recipient information.
const messageToJSON = (recipientId, messagePayload) => {
  return {
    recipient: {
      id: recipientId,
    },
    message: messagePayload,
  };
};

// Send one or more messages using the Send API.
const sendMessage = (recipientId, messagePayloads) => {
  const messagePayloadArray = castArray(messagePayloads)
    .map((messagePayload) => messageToJSON(recipientId, messagePayload));

  api.callMessagesAPI([
    typingOn(recipientId),
    ...messagePayloadArray,
    typingOff(recipientId),
  ]);
};

// Send a read receipt to indicate the message has been read
const sendReadReceipt = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'mark_seen', // eslint-disable-line camelcase
  };

  api.callMessagesAPI(messageData);
};

// Send the initial message telling the user about the promotion.
const sendHelloMessage = (recipientId) => {
  logger.fbLog("send_message", {payload: "hello"}, recipientId);
  sendMessage(recipientId, messages.helloMessage);
};

const sendLocationMessage = (recipientId) => {
  logger.fbLog("send_message", {payload: "location"}, recipientId);
  sendMessage(recipientId, messages.locationMessage);
}

const sendErrorMessage = (recipientId) => {
  logger.fbLog("send_message", {payload: "error"}, recipientId);
  sendMessage(recipientId, messages.errorMessage);
}

const sendSimpleMessage = (recipientId, messageText) => {
  // console.log("at sendSimpleMessage:",messageText);
  logger.fbLog("send_message", {payload: "simple"}, recipientId);
  sendMessage(recipientId, messages.simpleMessage(messageText));
}

const sendYelpMessage = (recipientId, yelpData) => {
  logger.fbLog("send_message", {payload: "yelp"}, recipientId);
  sendMessage(recipientId, messages.yelpFoodMessage(yelpData));
}


export default {
  sendMessage,
  sendReadReceipt,
  sendHelloMessage,
  sendLocationMessage,
  sendErrorMessage,
  sendSimpleMessage,
  sendYelpMessage,
};
