// ===== MODULES ===============================================================
import sendApi from './send';

const BrandonID = process.env.BrandonID;
const ElaineID = process.env.ElaineID;

const handleItem = (item, senderId) => {
  let message = ''
  if (item === 'food') message = "Honey I'm hungry buy me food"
  else if (item === 'money') message = "Honey I need money..."
  else if (item === 'love') message = "I love you Honey!"
  
  if (item === 'yelpFood'){ // Special case
  	sendApi.sendLocationMessage(senderId);
    // promptForLocation(sender_psid, "Select a location.");
  } else {
    if (senderId === BrandonID){ // send to Elaine
    	// console.log("at handleItem:",senderId,message);
    	sendApi.sendSimpleMessage(senderId, "Got it, sending now");
    	sendApi.sendSimpleMessage(BrandonID, message);
      // sendTextMessage(BrandonID, "Got it, sending now");
      // sendTextMessage(BrandonID, message);
    } else if (senderId === ElaineID){
    	sendApi.sendSimpleMessage(senderId, "Got it, sending now");
    	sendApi.sendSimpleMessage(BrandonID, message);
      // sendTextMessage(ElaineID, "Got it, sending now");
      // sendTextMessage(BrandonID, message);
    } else {
    	sendApi.sendErrorMessage(senderId);
      // sendTextMessage(senderId, "Sorry, I don't know who to message.");
    }
  }
}


const searchNLP = (nlp, name) => {
  if (nlp.entities[name]){
    return nlp.entities[name][0];
  } else{
    // TODO: or remove
  }
}

const handleNLP = (nlp, senderId) => {
	const intent = searchNLP(nlp, 'intent');
  const greetings = searchNLP(nlp, 'greetings');
  // const person = searchNLP(nlp, 'person');
  const item = searchNLP(nlp, 'item');

  if (intent && intent.confidence > 0.8){
    if (intent.value === 'notify') {
      if (item && item.confidence > 0.8){
        handleItem(item.value, senderId);
      } else {
      	sendApi.sendErrorMessage(senderId);
        // sendTextMessage(senderId, "Sorry, I don't know what you want.")
      }
    } else if (intent.value === 'isHungry'){
      if (item && item.confidence > 0.8) {
      	sendApi.sendLocationMessage(senderId);
        // promptForLocation(senderId, "Select a location.");
      }
    }
  } else if (greetings && greetings.confidence > 0.8) {
    // sendTextWithQuickReplies(senderId, "Hi, how can I help?")
    sendApi.sendHelloMessage(senderId);
  } else {
  	sendApi.sendErrorMessage(senderId);
    // sendTextMessage(senderId, "Sorry, I do not understand.")
  }
}

export default {
	handleNLP,
};