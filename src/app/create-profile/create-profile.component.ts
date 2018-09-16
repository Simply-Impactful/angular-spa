import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoUtil, Callback, CognitoCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { _ } from 'lodash';
import { User } from '../model/User';


@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit, CognitoCallback, OnDestroy {
  newUser: User;
  errorMessage: string;
  userType: any;
  private sub: any;
  callback: Callback;
  confirmPassword: string;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public cognitoUtil: CognitoUtil,
    public createProfileService: CreateProfileService) {
    const errorMessage = this.errorMessage;
  }

  ngOnInit() {
    this.newUser = new User();
    this.sub = this.route.params.subscribe(params => {
      this.userType = params['userType']; // (+) converts string 'id' to a number
    });
  }

  isPasswordValid(): boolean {
    const password = this.newUser.password;
    // Confirm they match
    if (password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      console.log(this.errorMessage + ' password ' + password + 'confirm Password ' + this.confirmPassword);
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createAccount() {
    if (this.newUser.password !== null && this.isPasswordValid()) {
      this.createProfileService.register(this.newUser, this);
    } else {
      this.errorMessage = 'Password must not be empty';
    }
  }

  cognitoCallback(message: string, result: any) {
    if (message !== null) { // error
      this.errorMessage = message;
      console.log('result: ' + this.errorMessage);
    } else { // success
      // move to the next step
      console.log('redirecting');
      this.router.navigate(['/confirmSignUp', result.user.username]);
    }
  }

  // might only be for the 'sign-in' flow?
  getParameters(callback: Callback) {
    const currentUser = this.cognitoUtil.getCurrentUser();
    console.log('currentUser ' + JSON.stringify(currentUser));

    if (currentUser !== null) {
      currentUser.getSession(function (err, session) {
        if (err) {
          console.log('UserParametersService: Couldn\'t retrieve the user');
        } else {
          currentUser.getUserAttributes(function (_err, result) {
            if (_err) {
              console.log('UserParametersService: in getParameters: ' + _err);
            } else {
              console.log('get User Attributes result ' + result);
              callback.callbackWithParam(result);
            }
          });
        }

      });
    } else {
      callback.callbackWithParam(null);
    }

  }
}
