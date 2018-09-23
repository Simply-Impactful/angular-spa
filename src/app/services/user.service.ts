import { Injectable, Inject } from '@angular/core';
import { User } from '../model/User';
import { LoggedInCallback, CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserSession, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { LogInService } from './log-in.service';

// let's use a global object to inject the window object
if (global === undefined) {
    const global = window;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userSource = new BehaviorSubject(new User());
    user$ = this.userSource.asObservable();
    public user: User;
    public cognitoUtil: CognitoUtil;

    buildUser(result: CognitoUserAttribute[], user: User) {
        console.log('building user ');
      //  const cognitoUser = this.cognitoUtil.getCurrentUser();
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const property = result[i].getName();
                this.user[property] = result[i].getValue();
            }
       //     this.user.username = cognitoUser.getUsername();
            console.log('user after ' + JSON.stringify(this.user));
            this.userSource.next(this.user);
            console.log(JSON.stringify(this.userSource.next(this.user)));
        }
        return this.user;
    }
}
