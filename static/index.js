function updateUserName(user) {
  const greetingNode = document.getElementById('greeting');
  if (greetingNode) {
    greetingNode.textContent = `Hello, ${user.first_name}.`;
  } else {
    console.error('Unable to locate greeting node');
  }
}

function lookupUserName(authResponse) {
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
