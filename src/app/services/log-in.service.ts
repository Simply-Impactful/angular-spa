import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/User';
import { LoggedInCallback, CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';
import { environment } from '../../environments/environment';

// let's use a global object to inject the window object
if (global === undefined) {
    const global = window;
}

@Injectable({
    providedIn: 'root'
})
export class LogInService {
    public apiPort: string;
    public apiEndpoint: string;
    public url: string = window.location.protocol + '//' + window.location.hostname;
    public user: User;
    // public cognitoUtil: CognitoUtil;

    constructor(private http: HttpClient, public cognitoUtil: CognitoUtil) {
        this.apiPort = window.location.port ? ':4200/' : '/';
        this.apiEndpoint = this.url + this.apiPort;
    }

    authenticate(username: string, password: string, callback: CognitoCallback) {
        console.log('LogInService: starting the authentication');

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
            newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback(`User needs to set password.`, null),
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
                }
            });
        } else {
            console.log('LogInService: can\'t retrieve the current user');
            callback.isLoggedIn('Can\'t retrieve the CurrentUser', false);
        }
    }
}
