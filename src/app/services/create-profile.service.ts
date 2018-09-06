import {Inject, Injectable} from "@angular/core";
import {CognitoCallback, CognitoUtil} from "./cognito.service";
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool} from "amazon-cognito-identity-js";
import {NewUser} from "../create-profile/create-profile.component";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
//import {NewPasswordUser} from "../public/auth/newpassword/newpassword.component";
import * as AWS from "aws-sdk/global";
import { environment } from "../../environments/environment";
import * as awsservice from "aws-sdk/lib/service";

@Injectable()
export class CreateProfileService {

    accessKeyId: string  = "";
    secretAccessKey: string = "";
    sessionToken: string = "";

    constructor(public cognitoUtil: CognitoUtil) {
    }

    getCredentials(identityPoolId: string){

        // following steps from resource:
       // https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-integrating-user-pools-javascript.html#tutorial-integrating-user-pools-userpool-object-javascript

        // Initialize the Amazon Cognito credentials provider
        AWS.config.region = 'us-east-1'; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: identityPoolId,
        })
          
        // defining the properties...but they're all null
        this.accessKeyId = AWS.config.credentials.accessKeyId;
        this.secretAccessKey = AWS.config.credentials.secretAccessKey;
        this.sessionToken = AWS.config.credentials.sessionToken;

        console.log("aws credentials " + JSON.stringify(AWS.config.credentials));
      //  console.log("access key, secretaccesskey, session token " + this.accessKeyId + ", " +this.secretAccessKey + ", " + this.sessionToken);
    }

    register(user: NewUser, callback: CognitoCallback): void {

        this.getCredentials(CognitoUtil._IDENTITY_POOL_ID);

        let attributeList = [];

        let dataFirstName = {
            Name: 'firstName',
            Value: user.firstName
        };
        let dataLastName = {
            Name: 'lastName',
            Value: user.lastName
        };
        let dataEmail = {
            Name: 'email',
            Value: user.email
        }; 
        let dataZipcode = {
            Name: 'zipcode',
            Value: user.zipcode
        }; 
        let dataOrganization = {
            Name: 'organization',
            Value: user.organization
        };
        attributeList.push(new CognitoUserAttribute(dataFirstName));
        attributeList.push(new CognitoUserAttribute(dataLastName));
        attributeList.push(new CognitoUserAttribute(dataEmail));
        attributeList.push(new CognitoUserAttribute(dataZipcode));
        attributeList.push(new CognitoUserAttribute(dataOrganization));

        var poolData = { 
            UserPoolId : CognitoUtil._USER_POOL_ID,
            ClientId : CognitoUtil._CLIENT_ID
        };
        var userPool = new CognitoUserPool(poolData);
        
        var userData = {
             Username : 'emily.hendricks@fmr.com',
             Pool : userPool
        };

        var cognitoUser = new CognitoUser(userData);

        console.log("userPool " + JSON.stringify(userPool));
        console.log("current user " + JSON.stringify(cognitoUser));
        console.log("userPool - current User. null.. " + JSON.stringify(userPool.getCurrentUser()));
        userPool.signUp(user.username, user.password, attributeList, null, function (err, result) {
            if (err) {
                console.log("Sign Up Error, sending to callback. ERROR "+ JSON.stringify(err) + "MESSAGE" + err.message);
                callback.cognitoCallback(err.message, null);
            } else {
                console.log("CreateProfileService: registered user is " + result);
                callback.cognitoCallback(null, result);
            }
        });
    }

    confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    resendCode(username: string, callback: CognitoCallback): void {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    /**newPassword(newPasswordUser: NewPasswordUser, callback: CognitoCallback): void {
        console.log(newPasswordUser);
        // Get these details and call
        //cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        let authenticationData = {
            Username: newPasswordUser.username,
            Password: newPasswordUser.existingPassword,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
            Username: newPasswordUser.username,
            Pool: this.cognitoUtil.getUserPool()
        };

        console.log("UserLoginService: Params set...Authenticating the user");
        let cognitoUser = new CognitoUser(userData);
        console.log("UserLoginService: config is " + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                // User was signed up by an admin and must provide new
                // password and required attributes, if any, to complete
                // authentication.

                // the api doesn't accept this field back
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(newPasswordUser.password, requiredAttributes, {
                    onSuccess: function (result) {
                        callback.cognitoCallback(null, userAttributes);
                    },
                    onFailure: function (err) {
                        callback.cognitoCallback(err, null);
                    }
                });
            },
            onSuccess: function (result) {
                callback.cognitoCallback(null, result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err, null);
            }
        });
    } */
}
