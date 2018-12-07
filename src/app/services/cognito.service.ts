import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import * as awsservice from 'aws-sdk/lib/service';
import * as CognitoIdentity from 'aws-sdk/clients/cognitoidentity';
import { AWSError } from 'aws-sdk/global';
import { User } from '../model/User';
import * as CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

/**
 * Created by Vladimir Budilov
 */

export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;
    handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;
}

export interface LoggedInCallback {
    callbackWithParams(error: AWSError, result: any): void;
    isLoggedIn(message: string, loggedIn: boolean): void;
    callbackWithParam(result: any): void;
}

export interface ChallengeParameters {
    CODE_DELIVERY_DELIVERY_MEDIUM: string;
    CODE_DELIVERY_DESTINATION: string;
}

export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
    callbackWithParameters(error: AWSError, result: any);
    cognitoCallbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {

    public static _REGION = environment.region;
    public static _IDENTITY_POOL_ID = environment.identityPoolId;
    public static _USER_POOL_ID = environment.userPoolId;
    public static _CLIENT_ID = environment.clientId;
    public static _POOL_DATA: any = {
        UserPoolId: CognitoUtil._USER_POOL_ID,
        ClientId: CognitoUtil._CLIENT_ID
    };

    public identityCreds: AWS.CognitoIdentityCredentials.CognitoIdentityCredentialsInputs;
    public cognitoCreds: AWS.CognitoIdentityCredentials;

    getUserPool() {
        if (environment.cognito_idp_endpoint) {
            CognitoUtil._POOL_DATA.endpoint = environment.cognito_idp_endpoint;
        }
        return new CognitoUserPool(CognitoUtil._POOL_DATA);
    }

    getCurrentUser() {
        return this.getUserPool().getCurrentUser();
    }

    listUsers(optionalFilter?: any): any {
      const attributesToGet = ['Username']; // FILTER AND PAGINAITONTOKEN OPTIONAL
      const listUsersRequest: CognitoIdentityServiceProvider.ListUsersRequest = {
        UserPoolId: environment.userPoolId,
        Limit: 60
      };
      let unfilteredUsers = [];
      const filteredUsers = [];
      const promise = new Promise((resolve, reject) => {
        new AWS.CognitoIdentityServiceProvider().listUsers(listUsersRequest, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        // successful api call
        if (data.hasOwnProperty('Users')) {
          unfilteredUsers = data.Users;

   //     console.log('data ' + JSON.stringify(unfilteredUsers));

          if (optionalFilter !== null && optionalFilter !== undefined) {
            for (let index = 0; index < unfilteredUsers.length; ++index) {
              filteredUsers.push(unfilteredUsers[index][optionalFilter]);
            }
          resolve(filteredUsers);
        } else {
          resolve(unfilteredUsers);
        }
        }
      }
    });
  });
  return promise;
  }

    // AWS Stores Credentials in many ways, and with TypeScript this means that
    // getting the base credentials we authenticated with from the AWS globals gets really murky,
    // having to get around both class extension and unions. Therefore, we're going to give
    // developers direct access to the raw, unadulterated CognitoIdentityCredentials
    // object at all times.
    setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
        this.cognitoCreds = creds;
    }

    getCognitoCreds() {
        return this.cognitoCreds;
    }

    // This method takes in a raw jwtToken and uses the global AWS config options to build a
    // CognitoIdentityCredentials object and store it for us. It also returns the object to the caller
    // to avoid unnecessary calls to setCognitoCreds.
    buildCognitoCreds(idTokenJwt: string) {
        let url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;

        if (environment.cognito_idp_endpoint) {
            url = environment.cognito_idp_endpoint + '/' + CognitoUtil._USER_POOL_ID;
        }

        const logins: CognitoIdentity.LoginsMap = {
            // trying this.. already done in aws.service: getCognitoParametersForIdConsolidation
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_Iz6DhxAP7': idTokenJwt
        };

        logins[url] = idTokenJwt;
        const params = {
            IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID, /* required */
            Logins: logins
        };

        const serviceConfigs = <awsservice.ServiceConfigurationOptions>{};
        if (environment.cognito_identity_endpoint) {
            serviceConfigs.endpoint = environment.cognito_identity_endpoint;
        }
        const creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);
    //    console.log('setting creds ' + JSON.stringify(creds));
        this.setCognitoCreds(creds);
        return creds;
    }


    getCognitoIdentity(): string {
        return this.cognitoCreds.identityId;
    }

    getAccessToken(callback: Callback): void {
        if (callback === null) {
            throw new Error('CognitoUtil: callback in getAccessToken is null...returning');
        }

        if (this.getCurrentUser() !== null) {

            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.error('CognitoUtil: Can\'t set the credentials:' + err);
                    callback.callbackWithParam(null);
                } else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getAccessToken().getJwtToken());
                    }
                }
            });
        } else {
            callback.callbackWithParam(null);
        }
    }

    updateUserAttribute(callback: LoggedInCallback, key: string, value: string) {
        if (key === 'organization' || key === 'lastName') {
            key = 'custom:' + key;
        }
        const cognitoUser = this.getCurrentUser();
        if (cognitoUser !== null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    callback.isLoggedIn(err, false);
                } else {
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            callback.isLoggedIn('Can\'t retrieve the CurrentUser', false);
        }
        const attributeList = [];
        const attribute = {
              Name : key,
              Value : value
       };
        const attribute1 = new CognitoUserAttribute(attribute);
        attributeList.push(attribute1);

        cognitoUser.updateAttributes(attributeList, function(error, result1) {
            if (error) {
                console.log('error ' + error);
             // not working because of type. Add an error callback?
                callback.callbackWithParam(error);
                window.location.reload();
                return;
            } else {
                callback.callbackWithParam(result1);
                window.location.reload();
            }
            console.log('Update call result: ' + result1);
        });
    }

    getIdToken(callback: Callback): void {
        if (callback === null) {
            throw new Error('CognitoUtil: callback in getIdToken is null...returning');
        }

        if (this.getCurrentUser() !== null) {
            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log('CognitoUtil: Can\'t set the credentials:' + err);
                    callback.callbackWithParam(null);
                } else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getIdToken().getJwtToken());
                    } else {
                        console.log('CognitoUtil: Got the id token, but the session isn\'t valid');
                    }
                }
            });
        } else {
            callback.callbackWithParam(null);
        }
    }

    getRefreshToken(callback: Callback): void {
        if (callback === null) {
            throw new Error('CognitoUtil: callback in getRefreshToken is null...returning');
        }

        if (this.getCurrentUser() !== null) {
            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log('CognitoUtil: Can\'t set the credentials:' + err);
                    callback.callbackWithParam(null);
                } else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getRefreshToken());
                    }
                }
            });
        } else {
            callback.callbackWithParam(null);
        }
    }

    refresh(): void {
        this.getCurrentUser().getSession(function (err, session) {
            if (err) {
                console.log('CognitoUtil: Can\'t set the credentials:' + err);
            } else {
                if (session.isValid()) {
                    console.log('CognitoUtil: refreshed successfully');
                } else {
                    console.log('CognitoUtil: refreshed but session is still not valid');
                }
            }
        });
    }

}
