import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { LoggedInCallback, CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { environment } from '../../environments/environment';
import { Parameters } from './parameters';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';
import { AWSError } from 'aws-sdk';

// let's use a global object to inject the window object
if (global === undefined) {
    const global = window;
}

@Injectable({
    providedIn: 'root'
})
export class LogInService {
    public accessToken = null;
    constructor(
        public cognitoUtil: CognitoUtil) { }

    authenticate(username: string, password: string, callback: LoggedInCallback) {
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
                callback.callbackWithParams('User needs to set password.', null),
            onSuccess: result => this.onLoginSuccess(callback, result),
            onFailure: err => this.onLoginError(callback, err)
        });
    }

    private onLoginSuccess = (callback: LoggedInCallback, session: CognitoUserSession) => {
        this.accessToken = session.getAccessToken();
        console.log('on login success');

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
            callback.callbackWithParams(null, session);
            /**
            if (err) {
                console.log('err ' + err);
                callback.callbackWithParams(err, session);
            } else {
                callback.callbackWithParams(null, session);
            } **/
        });
    }

    private onLoginError = (callback: LoggedInCallback, err) => {
        // always print the error
        console.error('Login error message ' + err.code);
        console.error('LOGIN ERROR: ' + err.message);
        if (err.code === 'InvalidParameterException') {
            callback.callbackWithParams('Please enter Username', null);

        } else {
            callback.callbackWithParams(err.message, null);
        }
    }

    isAuthenticated(callback: LoggedInCallback) {
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
                                console.log('LogInService ERROR: in getUserAttributes: ' + error.message);
                                callback.callbackWithParam(err);
                            } else {
                                if (result) {
                                    callback.callbackWithParam(result);
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
            onSuccess: function () {},
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                callback.cognitoCallback(null, null);
            }
        });
    }

    confirmNewPassword(username: string, verificationCode: string, password: string, callback: CognitoCallback) {
        const userData = {
            Username: username,
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
