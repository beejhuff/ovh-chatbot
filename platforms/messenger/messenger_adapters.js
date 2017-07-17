"use strict";

const { BUTTON_TYPE } = require("../generics");

function textMessageAdapter (message) {
  return message.text;
}

function buttonAdapter (button) {
  switch (button.type) {
  case BUTTON_TYPE.POSTBACK:
  case BUTTON_TYPE.MORE:
    return {
      type: button.type,
      title: button.text,
      payload: button.value
    };
  case BUTTON_TYPE.URL:
    return {
      type: button.type,
      url: button.value,
      title: button.text
    };
  case BUTTON_TYPE.ACCOUNT_LINKING:
    return {
      type: button.type,
      url: button.value
    };
  default:
    return button;
  }
}

function buttonsMessageAdapter (message) {
  return {
    template_type: "button",
    text: message.text || "",
    buttons: message.attachments.buttons.map(buttonAdapter)
  };
}

function elementAdapter (button) {
  return {
    content_type: "text",
    title: button.title,
    payload: button.payload
  };
}


function buttonsListMessageAdapter (message) {
  const eltButtons = message.attachments.buttons.filter((button) => {
    if (button.text === "" || button.value === "") {
      return false;
    }
    return true;
  });

  return {
    text: message.text,
    quick_replies: eltButtons.map((button) => elementAdapter(buttonAdapter(button)))
  };
}

module.exports = {
  textMessageAdapter,
  buttonAdapter,
  buttonsMessageAdapter,
  elementAdapter,
  buttonsListMessageAdapter
};
