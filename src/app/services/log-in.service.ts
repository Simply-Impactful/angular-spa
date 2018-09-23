import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { LoggedInCallback, CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserSession, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { environment } from '../../environments/environment';
import { Parameters } from './parameters';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';

// let's use a global object to inject the window object
if (global === undefined) {
    const global = window;
}

@Injectable({
    providedIn: 'root'
})
export class LogInService {
    constructor(
        public cognitoUtil: CognitoUtil,
        private params: Parameters) { }

    authenticate(username: string, password: string, callback: CognitoCallback) {
        const authenticationData = {
            Username: username,
            Password: password,
        };

        const authenticationDetails = new AuthenticationDetails(authenticationData);

        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: (userAttributes, requiredAttributes) =>
                callback.cognitoCallback('User needs to set password.', null),
            onSuccess: result => this.onLoginSuccess(callback, result),
            onFailure: err => this.onLoginError(callback, err)
        });
    }

    private onLoginSuccess = (callback: CognitoCallback, session: CognitoUserSession) => {
        AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(session.getIdToken().getJwtToken());

        // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
        // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
        // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
        // security credentials. The identity is then injected directly into the credentials object.
        // If the first SDK call we make wants to use our IdentityID, we have a
        // chicken and egg problem on our hands. We resolve this problem by 'priming' the AWS SDK by calling a
        // very innocuous API call that forces this behavior.
        const clientParams: any = {};
        if (environment.sts_endpoint) {
            clientParams.endpoint = environment.sts_endpoint;
        }

        const sts = new STS(clientParams);
        sts.getCallerIdentity(function (err, data) {
            callback.cognitoCallback(null, session);
        });
    }

    private onLoginError = (callback: CognitoCallback, err) => {
        // always print the error
        console.error(err.message);
        callback.cognitoCallback(err.message, null);
    }

    isAuthenticated(callback: LoggedInCallback, user: User) {

        if (callback === null) {
            throw new Error('LogInService: Callback in isAuthenticated() cannot be null');
        }
        const cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser !== null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log('LogInService: Couldn\'t get the session: ' + err, err.stack);
                    callback.isLoggedIn(err, false);
                } else {
                    callback.isLoggedIn(err, session.isValid());
                    cognitoUser.getUserAttributes(function (error, result) {
                        if (err) {
                            console.log('LogInService: in getUserAttributes: ' + error);
                        } else {
                            if (result) {
                                //  callback.callbackWithParam(result);
                                user = this.params.buildUser(result, cognitoUser, user);
                            }
                        }
                    });
                }
            });
        } else {
            console.log('LogInService: can\'t retrieve the current user');
            callback.isLoggedIn('Can\'t retrieve the CurrentUser', false);
        }
    }

    forgotPassword(username: string, callback: CognitoCallback) {
        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function () {

            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                callback.cognitoCallback(null, null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        const userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function () {
                callback.cognitoCallback(null, null);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            }
        });
    }
}
