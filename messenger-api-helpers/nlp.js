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
  } else {
    if (senderId === BrandonID){ // send to Elaine
    	sendApi.sendSimpleMessage(senderId, "Got it, sending now");
    	sendApi.sendSimpleMessage(BrandonID, message);
    } else if (senderId === ElaineID){
    	sendApi.sendSimpleMessage(senderId, "Got it, sending now");
    	sendApi.sendSimpleMessage(BrandonID, message);
    } else {
    	sendApi.sendErrorMessage(senderId);
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
  const item = searchNLP(nlp, 'item');

  if (intent && intent.confidence > 0.8){
    if (intent.value === 'notify') {
      if (item && item.confidence > 0.8){
        handleItem(item.value, senderId);
      } else {
      	sendApi.sendErrorMessage(senderId);
      }
    } else if (intent.value === 'isHungry'){
      if (item && item.confidence > 0.8) {
      	sendApi.sendLocationMessage(senderId);
      }
    }
  } else if (greetings && greetings.confidence > 0.8) {
    sendApi.sendHelloMessage(senderId);
  } else {
  	sendApi.sendErrorMessage(senderId);
  }
}

export default {
	handleNLP,
};