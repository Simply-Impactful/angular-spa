import {Inject, Injectable} from "@angular/core";
import {CognitoCallback, CognitoUtil} from "./cognito.service";
import {AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import {NewUser} from "../create-profile/create-profile.component";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
//import {NewPasswordUser} from "../public/auth/newpassword/newpassword.component";
import * as AWS from "aws-sdk/global";
import { environment } from "../../environments/environment";
import * as awsservice from "aws-sdk/lib/service";
import {AwsUtil} from "./aws.service";

@Injectable()
export class CreateProfileService {

    accessKeyId: string  = "";
    secretAccessKey: string = "";
    sessionToken: string = "";

    constructor(public cognitoUtil: CognitoUtil, public awsUtil: AwsUtil) {
    }

    register(user: NewUser, callback: CognitoCallback): void {

        // lamda token - got from console.. need to integrate API Gateway to call this in the code
        // resource for the function used: https://stackoverflow.com/questions/37438879/unable-to-verify-secret-hash-for-client-in-amazon-cognito-userpools
        // WHERE?? Do we put this token??
       // var idToken = "XV0TlWPJW1lnub2ajJsjOp3ttFByeUzSMtwbdIMmB9A=";
       var idToken = "1bmsa8v91fqv9atc416881pkbcs0hool8dcgq4g00c2ssu0gbcpa";
      // take this flow to setup AWS service and to build credentials in the AWS.config.credentials
      // trying to authenticate signUp call to avoid this NotAuthorized exception
     //this.awsUtil.initAwsService(null, true, idToken);
  
        let attributeList = [];

        let dataFirstName = {
            Name: 'name',
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
            Name: 'address',
            Value: user.zipcode
        }; 
        let dataOrganization = {
            Name: 'organization',
            Value: user.organization
        };
        let dataPicture = {
            Name: 'picture',
            Value: ""
        };
        attributeList.push(new CognitoUserAttribute(dataFirstName));
        //attributeList.push(new CognitoUserAttribute(dataLastName));
      //  attributeList.push(new CognitoUserAttribute(dataEmail));
        attributeList.push(new CognitoUserAttribute(dataZipcode));
      //  attributeList.push(new CognitoUserAttribute(dataOrganization));
        attributeList.push(new CognitoUserAttribute(dataPicture));

        var poolData = { 
            UserPoolId : CognitoUtil._USER_POOL_ID,
            ClientId : CognitoUtil._CLIENT_ID
        };
        var userPool = new CognitoUserPool(poolData);
        
        var userData = {
             Username : user.username,
             Pool : userPool
        };

        // why isn't this the same as my current user
       var cognitoUser = new CognitoUser(userData);

        console.log("userPool " + JSON.stringify(userPool));
        console.log("cognito user " + JSON.stringify(cognitoUser));
        console.log("userPool - current User. Should be same as cognito User (I think) " + JSON.stringify(userPool.getCurrentUser()));
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

 /**   confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

      //  let cognitoUser = new CognitoUser(userData);

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

      //  let cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    } **/

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
