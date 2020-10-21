import { Injectable } from '@angular/core';
import { LoggedInCallback, CognitoUtil } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { Parameters } from '../services/parameters';
import { LogInService } from '../services/log-in.service';
import { User } from '../model/User';

@Injectable()
export class UserPermission implements LoggedInCallback {

    user: User;

    constructor(public cognitoUtil: CognitoUtil, public loginService: LogInService) {
        this.loginService.isAuthenticated(this);
    }

    // response of listUserActions API - LoggedInCallback Interface
    callbackWithParams(error: AWSError, result: any): void {
        // don't need, but required by interface
    }

    // response of isAuthenticated method in login service
    callbackWithParam(result: any): void {
        const params = new Parameters();
        this.user = params.buildUser(result, this.cognitoUtil.getCurrentUser());
    }

    isLoggedIn(message: string, loggedIn: boolean): void {
        // don't need, but required by interface
    }

    isNotStudent() {
        return this.user && this.user.userType !== 'individual';
    }
}
