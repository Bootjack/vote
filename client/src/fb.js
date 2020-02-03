const callbackHandlers = [];
const facebookData = {};

function updateUserName(user) {
  const greetingNode = document.getElementById('greeting');
  if (greetingNode) {
    greetingNode.textContent = `Hello, ${user.first_name}.`;
  } else {
    console.error('Unable to locate greeting node');
  }
}

function lookupUserName(authResponse) {
  facebookData.authResponse = authResponse;
  callbackHandlers.forEach(handler => handler(facebookData));
  FB.api(`/${authResponse.userID}`, {fields: 'first_name'}, function (response) {
    if (response && !response.error) {
      updateUserName(response)
    } else {
      console.error('Bad response from Facebook API');
      if (response) console.error(response.error);
    }
  });
}

function onFacebookReady() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      lookupUserName(response.authResponse);
    } else {
      FB.login();
    }
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId: process.env.FB_APP_ID,
    cookie: true,
    xfbml: true,
    version: process.env.FB_VERSION
  });
  FB.AppEvents.logPageView();
  onFacebookReady();
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

export function registerFacebookReadyHandler(callback) {
  if (facebookData.authResonse) {
    callback(facebookData);
  } else {
    callbackHandlers.push(callback);
  }
}
