/* eslint-disable camelcase */
/* eslint-disable max-len */

/*
 * MESSAGES
 *
 * Objects and methods that create objects that represent
 * messages sent to Messenger users.
 */

const SERVER_URL = process.env.SERVER_URL;

/**
 * Button for displaying the preferences menu inside a webview
 */
const setPreferencesButton = {
  type: 'web_url',
  title: 'Preferences',
  url: `${SERVER_URL}/`,
  webview_height_ratio: 'tall',
  messenger_extensions: true,
};


const simpleMessage = (messageText) => {
  return {
    text: messageText,
  };
};

const yelpRestaurantItem = ({name, categories, image_url, url}) => {
  return {
    title: name,
    subtitle: categories[0].title,
    image_url: image_url,
    default_action: {
      type: 'web_url',
      url: url
    }
  };
}

const yelpFoodMessage = (restaurants) => {
  const listItems = restaurants.map(yelpRestaurantItem);

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'list',
        top_element_style: 'compact',
        elements: listItems
      },
    },
  };
}

const locationMessage = {
  text: 'Select a location.',
  quick_replies: [
    {
      content_type: 'location'
    }
  ]
}


/**
 * Message that informs the user of the promotion and prompts
 * them to set their preferences.
 */

const helloMessage = {
  text: 'Hi, what can I do for you?',
  quick_replies: [
        {
          content_type: 'text',
          title: 'ask for food',
          payload: 'food'
        },
        {
          content_type: 'text',
          title: 'ask for money',
          payload: 'money'
        },
        {
          content_type: 'text',
          title: 'send affection',
          payload: 'love'
        },
        {
          content_type: 'text',
          title: 'find food',
          payload: 'yelpFood'
        }
      ]
};

const errorMessage = {
  text: 'Sorry, I do not understand.'
};

// const helloMessage = {
//   attachment: {
//     type: 'template',
//     payload: {
//       template_type: 'button',
//       text: 'Hi, what can I do for you?',
//       // buttons: [setPreferencesButton],
//     },
//   },
// };

/**
 * The persistent menu for users to use.
 */
const persistentMenu = {
  setting_type: 'call_to_actions',
  thread_state: 'existing_thread',
  call_to_actions: [
    setPreferencesButton,
    // changeGiftButton,
  ],
};

/**
 * The Get Started button.
 */
const getStarted = {
  setting_type: 'call_to_actions',
  thread_state: 'new_thread',
  call_to_actions: [
    {
      payload: JSON.stringify({
        type: 'GET_STARTED',
      }),
    },
  ],
};

export default {
  helloMessage,
  simpleMessage,
  errorMessage,
  locationMessage,
  yelpFoodMessage,
  persistentMenu,
  getStarted,
};

