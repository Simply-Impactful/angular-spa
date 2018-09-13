import { Inject, Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { NewUser } from '../create-profile/create-profile.component';
import * as CognitoIdentity from 'aws-sdk/clients/cognitoidentity';
// import { NewPasswordUser } from '../public/auth/newpassword/newpassword.component';
import * as AWS from 'aws-sdk/global';
import { environment } from '../../environments/environment';
import * as awsservice from 'aws-sdk/lib/service';
import { AwsUtil } from './aws.service';

@Injectable()
export class CreateProfileService {

    accessKeyId: string = '';
    secretAccessKey: string = '';
    sessionToken: string = '';

    constructor (
        public cognitoUtil: CognitoUtil,
        public awsUtil: AwsUtil) {}

    register(user: NewUser, callback: CognitoCallback): void {

        // lamda token - got from console.. need to integrate API Gateway to call this in the code
        // resource for the function used:
        // https://stackoverflow.com/questions/37438879/unable-to-verify-secret-hash-for-client-in-amazon-cognito-userpools
        // WHERE?? Do we put this token??
        // var idToken = 'XV0TlWPJW1lnub2ajJsjOp3ttFByeUzSMtwbdIMmB9A=';

        const attributeList = [];

        const dataFirstName = {
            Name: 'name',
            Value: user.firstName
        };
        const dataLastName = {
            Name: 'lastName',
            Value: user.lastName
        };
        const dataEmail = {
            Name: 'email',
            Value: user.email
        };
        const dataZipcode = {
            Name: 'address',
            Value: user.zipcode
        };
        const dataOrganization = {
            Name: 'organization',
            Value: user.organization
        };
        const dataPicture = {
            Name: 'picture',
            Value: ''
        };

        attributeList.push(new CognitoUserAttribute(dataFirstName));
        attributeList.push(new CognitoUserAttribute(dataEmail));
        attributeList.push(new CognitoUserAttribute(dataZipcode));
        attributeList.push(new CognitoUserAttribute(dataPicture));

        const poolData = {
            UserPoolId: CognitoUtil._USER_POOL_ID,
            ClientId: CognitoUtil._CLIENT_ID
        };
        const userPool = new CognitoUserPool(poolData);

        const userData = {
            Username: user.username,
            Pool: userPool
        };

        userPool.signUp(user.username, user.password, attributeList, null, function (err, result) {
            if (err) {
                console.error('Sign Up Error, sending to callback. ERROR ' + JSON.stringify(err) + 'MESSAGE' + err.message);
                callback.cognitoCallback(err.message, null);
            } else {
                // console.log('attribute list ' + JSON.stringify(attributeList));
                // console.log('CreateProfileService: registered user is ' + JSON.stringify(result));
                callback.cognitoCallback(null, result);
            }
        });
    }

    /** The user will enter the verification code from their email */
    confirmVerificationCode(username: string, confirmationCode: string, callback: CognitoCallback): void {

        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    /** In case they didn't receive the code */
    resendCode(username: string, callback: CognitoCallback): void {
        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }
}
