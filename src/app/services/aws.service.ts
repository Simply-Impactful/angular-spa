import { Injectable } from '@angular/core';
import { Callback, CognitoUtil } from './cognito.service';
import * as AWS from 'aws-sdk/global';

/**
 * Created by Vladimir Budilov
 */

// declare var AMA: any;

@Injectable()
export class AwsUtil {
    public static firstLogin: boolean = false;
    public static runningInit: boolean = false;

    constructor(public cognitoUtil: CognitoUtil) {
        AWS.config.region = CognitoUtil._REGION;
    }

    /**
     * This is the method that needs to be called in order to init the aws global creds
     */
    initAwsService(callback: Callback, isLoggedIn: boolean, idToken: string) {

        if (AwsUtil.runningInit) {
            // Need to make sure I don't get into an infinite loop here, so need to exit if this method is running already
            console.log('AwsUtil: Aborting running initAwsService()...it\'s running already.');
            // instead of aborting here, it's best to put a timer
            if (callback !== null) {
                callback.callback();
                callback.callbackWithParam(null);
            }
            return;
        }

        AwsUtil.runningInit = true;

        // First check if the user is authenticated already
        if (isLoggedIn) {
            this.setupAWS(isLoggedIn, callback, idToken);
        }
    }


    /**
     * Sets up the AWS global params
     *
     * @param isLoggedIn
     * @param callback
     */
    setupAWS(isLoggedIn: boolean, callback: Callback, idToken: string): void {

        if (isLoggedIn) {
            /** Setup mobile analytics
            const options = {
                appId: '32673c035a0b40e99d6e1f327be0cb60',
                appTitle: 'aws-cognito-angular2-quickstart'
            };

            // TODO: The mobile Analytics client needs some work to handle Typescript. Disabling for the time being.
            // const mobileAnalyticsClient = new AMA.Manager(options);
            // mobileAnalyticsClient.submitEvents(); **/

            this.addCognitoCredentials(idToken, callback);
        } else {
            // add some error handling or else.
            console.log('AwsUtil: User is not logged in');
        }

        if (callback !== null) {
            callback.callback();
            callback.callbackWithParam(null);
        }

        AwsUtil.runningInit = false;
    }

    addCognitoCredentials(idToken: string, callback: Callback): void {
        const creds = this.cognitoUtil.buildCognitoCreds(idToken);

        AWS.config.credentials = creds;
        console.log('creds ' + JSON.stringify(creds));

        creds.get(function (err) {
            if (!err) {
                if (AwsUtil.firstLogin) {
                    // save the login info to DDB
                    // this.ddb.writeLogEntry('login');
                    AwsUtil.firstLogin = false;
                }
            } else {
                // attempt a retry
                console.log('ERROR GETTING CREDS ' + JSON.stringify(err));
                // route them to login?
                // adding this in...
                callback.callbackWithParam('error getting user creds');
           }
        });
    }

 /**   getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
        console.log('AwsUtil: enter getCognitoParametersForIdConsolidation()');
        const url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;
        const logins: Array<string> = [];
        logins[url] = idTokenJwt;
        const params = {
            IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID, /* required */ /**
            Logins: logins
        };

        return params;
    } **/

}
