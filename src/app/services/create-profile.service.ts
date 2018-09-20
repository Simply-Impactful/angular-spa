import { Inject, Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { User } from '../model/User';
import * as CognitoIdentity from 'aws-sdk/clients/cognitoidentity';
// import { NewPasswordUser } from '../public/auth/newpassword/newpassword.component';
import * as AWS from 'aws-sdk/global';
import { environment } from '../../environments/environment';
import * as awsservice from 'aws-sdk/lib/service';
import { AwsUtil } from './aws.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CreateProfileService {
    userSource = new BehaviorSubject(new User());
    user$ = this.userSource.asObservable();
    user = new User;
    accessKeyId: string = '';
    secretAccessKey: string = '';
    sessionToken: string = '';

    constructor (
        public cognitoUtil: CognitoUtil,
        public awsUtil: AwsUtil) {}

    register(user: User, callback: CognitoCallback): void {

        const attributeList = [];

        const dataFirstName = {
            Name: 'name',
            Value: user.name
        };
        const dataLastName = {
            Name: 'custom:lastName',
            Value: user.lastName
        };
        const dataEmail = {
            Name: 'email',
            Value: user.email
        };
        const dataZipcode = {
            Name: 'address',
            Value: user.address
        };
        const dataOrganization = {
            Name: 'custom:organization',
            Value: user.organization
        };
        const dataPicture = {
            Name: 'picture',
            Value: ''
        };
        const dataUserPoints = {
            Name: 'custom:userPoints',
            Value: '0'
        };
        const dataUserType = {
            Name: 'custom:userType',
            Value: user.userType
        };
        const dataSecurityQuestion1 = {
            Name: 'custom:securityQuestion1',
            Value: user.securityQuestion1
        };
        const dataSecurityAnswer1 = {
            Name: 'custom:securityAnswer1',
            Value: user.securityAnswer1
        };

        attributeList.push(new CognitoUserAttribute(dataFirstName));
        attributeList.push(new CognitoUserAttribute(dataLastName));
        attributeList.push(new CognitoUserAttribute(dataEmail));
        attributeList.push(new CognitoUserAttribute(dataZipcode));
        attributeList.push(new CognitoUserAttribute(dataOrganization));
        attributeList.push(new CognitoUserAttribute(dataPicture));
        attributeList.push(new CognitoUserAttribute(dataUserPoints));
        attributeList.push(new CognitoUserAttribute(dataUserType));
        attributeList.push(new CognitoUserAttribute(dataSecurityQuestion1));
        attributeList.push(new CognitoUserAttribute(dataSecurityAnswer1));
     //   attributeList.push(new CognitoUserAttribute(dataSecurityQuestion3));
     //   attributeList.push(new CognitoUserAttribute(dataSecurityQuestion1));
     //   attributeList.push(new CognitoUserAttribute(dataSecurityQuestion1));
    //    attributeList.push(new CognitoUserAttribute(dataSecurityQuestion1));

        const poolData = {
            UserPoolId: CognitoUtil._USER_POOL_ID,
            ClientId: CognitoUtil._CLIENT_ID
        };
        const userPool = new CognitoUserPool(poolData);

        const userData = {
            Username: user.username,
            Pool: userPool
        };

        // if the user inputted the security Questions and answers, we can autoConfirm them
        if (user.securityQuestion1 && user.securityAnswer1) {
            this.user.name = user.name;
            this.userSource.next(this.user);
            userPool.signUp(user.username, user.password, attributeList, null, function (err, result) {
                if (err) {
                    console.error('Sign Up Error, sending to callback. ERROR ' + JSON.stringify(err) + 'MESSAGE' + err.message);
                    callback.cognitoCallback(err.message, null);
                } else {
                    callback.cognitoCallback(null, result);
                }
            });
        } else {
            callback.cognitoCallback('Please input an answer for each of the security questions', null);
        }
    }
}
