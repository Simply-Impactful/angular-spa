import { Inject, Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { User } from '../model/User';

import { AwsUtil } from './aws.service';
import { BehaviorSubject } from 'rxjs';
import { LogInService } from './log-in.service';

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
        public awsUtil: AwsUtil,
        public loginService: LogInService) {}

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
        // TODO: should this call S3Service.upload or read? or does this come with the response?
        const dataPicture = {
            Name: 'picture',
            Value: user.picture
        };
        const dataUserType = {
            Name: 'custom:userType',
            Value: user.userType
        };

        attributeList.push(new CognitoUserAttribute(dataFirstName));
        attributeList.push(new CognitoUserAttribute(dataLastName));
        attributeList.push(new CognitoUserAttribute(dataEmail));
        attributeList.push(new CognitoUserAttribute(dataZipcode));
        attributeList.push(new CognitoUserAttribute(dataOrganization));
        attributeList.push(new CognitoUserAttribute(dataPicture));
        attributeList.push(new CognitoUserAttribute(dataUserType));

        const poolData = {
            UserPoolId: CognitoUtil._USER_POOL_ID,
            ClientId: CognitoUtil._CLIENT_ID
        };
        const userPool = new CognitoUserPool(poolData);

        const userData = {
            Username: user.username,
            Pool: userPool
        };

        const loginService = new LogInService(this.cognitoUtil);
         userPool.signUp(user.username, user.password, attributeList, null, function (err, result) {
            if (err) {
                console.error('Sign Up Error, sending to callback. ERROR ' + JSON.stringify(err) + 'MESSAGE' + err.message);
                callback.cognitoCallback(err.message, null);
            } else {
                // authenticate the user
                loginService.authenticate(user.username, user.password, callback);
                // callback.cognitoCallback(null, result);
            }
        });
    }

    cognitoCallback(err, result) {
        console.log('err ' + err);
        console.log('err ' + result);
    }
}
