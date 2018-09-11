import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoUtil, Callback, CognitoCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { _ } from 'lodash';

/** User Registration Details */
export class NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  zipcode: string;
  organization: string;
}

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit, CognitoCallback, OnDestroy {
  private sub: any;

  newUser: NewUser;
  errorMessage: string;
  userType: any;
  callback: Callback;
  confirmPassword: string;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public cognitoUtil: CognitoUtil,
    public createProfileService: CreateProfileService) {
  }

  ngOnInit() {
    this.newUser = new NewUser();
    this.sub = this.route.params.subscribe(params => {
      this.userType = params['userType']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
    });
  }

  checkPasswords(): boolean {
    const password = this.newUser.password;
    // Determine if the password is 8 characters long...
    if (password.length >= 8) {
      // Confirm they match
      if (password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        console.error(this.errorMessage + ' password ' + password + 'confirm Password ' + this.confirmPassword);
        return false;
      } else { // they match, so check if it has a number
        if (this.hasNumber(password)) {
          return true;
        } else {
          this.errorMessage = 'Password is missing a number ';
          console.error(this.errorMessage + ' password ' + password);
          return false;
        }
      }
    } else { // password length is less than 8 chars.. need to override AWS req of 6?
      const errorMessage = 'Password must be 8 characters long';
      console.error(this.errorMessage);
      return false;
    }
  }

  hasNumber(password: string) {
    const numbers = '0123456789';
    // never used. Can we remove this?
    // function checkForNumber (password) {
    //   for (let i = 0; i < numbers.length; i++) {
    //     if (password.indexOf(numbers[i]) > -1) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }
    // }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createAccount() {
    let isValid = false;
    // check if password is null
    if (this.newUser.password !== null) {
      // confirm passwords are the same
      // isValid = this.checkPasswords();
      isValid = true;
    } else {
      this.errorMessage = 'Password must not be empty';
      console.log(this.errorMessage);
    }
    if (isValid) {
      // if they match, try to register the user through the create profile service
      this.createProfileService.register(this.newUser, this);
    }
  }

  cognitoCallback(message: string, result: any) {
    if (message !== null) { // error
      this.errorMessage = message;
      console.error('result: ' + this.errorMessage);
    } else {
      // move to the next step
      this.router.navigate(['/confirmSignUp', result.user.username]);
      // this.router.navigate(['/home']);
    }
  }

  // might only be for the 'sign-in' flow?
  getParameters(callback: Callback) {
    const currentUser = this.cognitoUtil.getCurrentUser();

    if (currentUser !== null) {
      currentUser.getSession(function (err, session) {
        if (err) {
          console.error('UserParametersService: Couldn\'t retrieve the user');
        } else {
          currentUser.getUserAttributes(function (_err, result) {
            if (_err) {
              console.error('UserParametersService: in getParameters: ' + _err);
            } else {
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
