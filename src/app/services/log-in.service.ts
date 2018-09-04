import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/User';
import { LoggedInCallback, CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";
import * as STS from "aws-sdk/clients/sts";
import { environment } from "../../environments/environment";

if (global === undefined) {
  var global = window;
}

@Injectable({
  providedIn: 'root'
})
export class LogInService {
  public apiPort : string;
  public apiEndpoint : string;
  public url : string = window.location.protocol + "//" + window.location.hostname;
  public user: User;
 // public cognitoUtil: CognitoUtil;

  constructor(private http: HttpClient, public cognitoUtil: CognitoUtil) {
    this.apiPort =  window.location.port ? ':4200/' : '/';
    this.apiEndpoint = this.url + this.apiPort;
   }

   authenticate(username: string, password: string, callback: CognitoCallback ){
    console.log("UserLoginService: starting the authentication");

    let authenticationData = {
        Username: username,
        Password: password,
    };
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let userData = {
        Username: username,
        Pool: this.cognitoUtil.getUserPool()
    };
    console.log("UserLoginService: Params set...Authenticating the user");
    let cognitoUser = new CognitoUser(userData);
    console.log("UserLoginService: config is " + AWS.config);
    cognitoUser.authenticateUser(authenticationDetails, {
        newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback(`User needs to set password.`, null),
        onSuccess: result => this.onLoginSuccess(callback, result),
        onFailure: err => this.onLoginError(callback, err)
    });
   }

   private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {

    console.log("In authenticateUser onSuccess callback");

    AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(session.getIdToken().getJwtToken());

    // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
    // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
    // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
    // security credentials. The identity is then injected directly into the credentials object.
    // If the first SDK call we make wants to use our IdentityID, we have a
    // chicken and egg problem on our hands. We resolve this problem by "priming" the AWS SDK by calling a
    // very innocuous API call that forces this behavior.
    let clientParams: any = {};
    if (environment.sts_endpoint) {
        clientParams.endpoint = environment.sts_endpoint;
    }
    let sts = new STS(clientParams);
    sts.getCallerIdentity(function (err, data) {
        console.log("UserLoginService: Successfully set the AWS credentials");
        callback.cognitoCallback(null, session);
    });
  }

  private onLoginError = (callback: CognitoCallback, err) => {
    callback.cognitoCallback(err.message, null);

  }

    isAuthenticated(callback: LoggedInCallback){
      return false;
    }
}
