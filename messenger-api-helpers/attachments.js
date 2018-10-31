// ===== MODULES ===============================================================
import sendApi from './send';
import yelp from 'yelp-fusion';

const YELP_API_KEY = process.env.YELP_API_KEY
const client = yelp.client(YELP_API_KEY)

const preferences = {
  term: 'restaurants',
  sort_by: 'best_match',
  open_now: true,
  limit: 4
}

const queryYelpFood = (preferences) => {
  return new Promise((resolve, reject) => {
    client.search(preferences).then(response =>{
      return resolve(response.jsonBody.businesses)
    }).catch(e => {
      console.log(e);
    });
  });
}

const sendYelpResults = async (senderId, preferences) => {
  let yelpData = await queryYelpFood(preferences);
  sendApi.sendSimpleMessage(senderId, "Here is your best choices!");
  sendApi.sendYelpMessage(senderId, yelpData);
}

const searchAttachments = (attachments, name) => {
  return attachments.find(item => {
    return item.type === name
  });
}

const handleAttachments = (attachments, senderId) => {
	const location = searchAttachments(attachments, 'location');

  if (location){
  	preferences.latitude = location.payload.coordinates.lat;
  	preferences.longitude = location.payload.coordinates.long;
  	sendYelpResults(senderId, preferences)
  }
}


export default {
	handleAttachments,
}