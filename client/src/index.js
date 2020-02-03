import AWS from 'aws-sdk';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js';
import {registerFacebookReadyHandler} from 'fb';

function getCognitoIdentityCredentials(facebookAuthResponse) {
  AWS.config.region = process.env.AWS_REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
    Logins: {
      'graph.facebook.com': facebookAuthResponse.accessToken
      //'accounts.google.com': 'GOOGLETOKEN'
    },
  });

  const cognitoIdentity = new AWS.CognitoIdentity();
  const cognitoIdentityParams = {
    IdentityPoolId: process.env.AWS_IDENTITY_POOL_ID,
    Logins: {
      'graph.facebook.com': facebookAuthResponse.accessToken
    }
  };
  cognitoIdentity.getId({}, function(err, res){
    if (err) {
      console.err(err);
    } else {
      console.log(res);
    }
  });
}

registerFacebookReadyHandler(getCognitoIdentityCredentials);
