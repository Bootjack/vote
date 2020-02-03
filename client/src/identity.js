import {CognitoAuth} from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

const authData = {
  ClientId: process.env.AWS_APP_CLIENT_ID,
  AppWebDomain: process.env.AWS_APP_WEB_DOMAIN,
  TokenScopesArray: ['email', 'profile', 'openid'],
  RedirectUriSignIn: process.env.HOSTNAME,
  RedirectUriSignOut: process.env.HOSTNAME,
  IdentityProvider: 'Facebook',
  UserPoolId: process.env.AWS_USER_POOL_ID
};

export function getCognitoToken(identityProviderData) {
  const hashErrorRegex = /error/;
  if (hashErrorRegex.test(window.location.hash)) {
    return;
  }

  const auth = new CognitoAuth(authData);
  auth.userhandler = {
    onSuccess: res => console.log('Success', res),
    onFailure: err => console.log('Error', err)
  };

  auth.getSession();
}
