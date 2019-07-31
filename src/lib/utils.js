const { structProtoToJson } = require('./structjson');

function getFulfillmentText(queryResult) {
  const contents = [];
  let foundSimpleResponse = false;
  if (queryResult.fulfillmentMessages && queryResult.fulfillmentMessages.length > 0) {
    for (let i = 0; i < queryResult.fulfillmentMessages.length; i++) {
      const element = queryResult.fulfillmentMessages[i];
      if (element.platform === 'ACTIONS_ON_GOOGLE' && element.message === 'simpleResponses') {
        // if we found the simple response, we do not return default text
        foundSimpleResponse = true;
        const text =
          element.simpleResponses.simpleResponses[0] &&
          element.simpleResponses.simpleResponses[0].textToSpeech;
        if (text && text.trim()) {
          contents.push(text.trim());
        }
      }
      if (
        !foundSimpleResponse &&
        element.platform === 'PLATFORM_UNSPECIFIED' &&
        element.message === 'text' &&
        element.text &&
        element.text.text &&
        element.text.text[0] &&
        element.text.text[0].trim()
      ) {
        contents.push(element.text.text[0].trim());
      }
    }
  }
  if (contents.length > 0) {
    return contents;
  } else {
    return queryResult.fulfillmentText && queryResult.fulfillmentText.length
      ? queryResult.fulfillmentText.trim()
      : '';
  }
}


function getRichResponses(queryResult) {
  const richResponses = [];
  if (queryResult.fulfillmentMessages && queryResult.fulfillmentMessages.length > 0) {
    queryResult.fulfillmentMessages.forEach(element => {
      if (
        (element.platform === 'ACTIONS_ON_GOOGLE' && element.message !== 'simpleResponses') ||
        element.payload
      ) {
        if (element.payload) {
          // customized payload
          let payload = structProtoToJson(element.payload);
          if (Array.isArray(payload.payload)) {
            payload.payload.forEach(item => {
              richResponses.push(item);
            });
          } else {
            richResponses.push(payload);
          }
        } else {
          // dialogflow rich responses
          richResponses.push(element);
        }
      }
    });
  }
  return richResponses;
}

module.exports = {
  getFulfillmentText,
  getRichResponses
};