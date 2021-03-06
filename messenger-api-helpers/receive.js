// ===== MODULES ===============================================================
import sendApi from './send';
import nlpApi from './nlp';
import attachmentsApi from './attachments';

// ===== STORES ================================================================
const util = require('util');

/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  // It's good practice to send the user a read receipt so they know
  // the bot has seen the message. This can prevent a user
  // spamming the bot if the requests take some time to return.
  sendApi.sendReadReceipt(senderId);

  if (message.text) { 
  	if(message.nlp) {
  		nlpApi.handleNLP(message.nlp, senderId);
  	}
  	else
  		sendApi.sendHelloMessage(senderId); 
  } else if(message.attachments) {
    attachmentsApi.handleAttachments(message.attachments, senderId);
  }
};


export default {
  handleReceiveMessage,
};
