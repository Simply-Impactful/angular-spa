import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoUtil, Callback, CognitoCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { User } from '../model/User';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit, CognitoCallback, OnDestroy {
  newUser = new User();
  errorMessage: string;
  private sub: any;
  callback: Callback;
  confirmPassword: string;
  genericMessage: string;
  confirmPassError: string = '';
  passwordError: string = '';
  emailError: string = '';
  nullUsernameError: string = '';
  nullNameError: string = '';
  nullZipError: string = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public cognitoUtil: CognitoUtil,
    public createProfileService: CreateProfileService) {
    const errorMessage = this.errorMessage;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.newUser.userType = params['userType']; // (+) converts string 'id' to a number
    });
    const currentPage = this.route.component.valueOf();
  //  console.log(currentPage );

  }

  ngOnDestroy() {
    if (this.sub) {
    this.sub.unsubscribe();
    }
  }

  createAccount() {
    if (this.checkInputs()) {
      this.createProfileService.register(this.newUser, this);
    }
  }

  checkInputs() {
    if (!this.newUser.email) {
      this.emailError = 'Email must not be empty';
    } else {
      this.emailError = '';
    }
    if (!this.newUser.password) {
      this.passwordError = 'Password must not be empty';
    } else {
      this.passwordError = '';
    }
    if (!this.newUser.username) {
      this.nullUsernameError = 'Username must not be empty';
    } else {
      this.nullUsernameError = '';
    }
    if (!this.newUser.name) {
      this.nullNameError = 'First Name must not be empty';
    } else {
      this.nullNameError = '';
    }
    if (!this.newUser.address) {
      this.nullZipError = 'Zip Code must not be empty';
    } else {
      this.nullZipError = '';
    }
    if (!this.isPasswordValid()) {
      console.log('pass doesnt match');
      this.confirmPassError = 'Passwords do not match';
    } else {
      return true;
    }
  }

  isPasswordValid(): boolean {
    const password = this.newUser.password;
    // Confirm they match
    if (password !== this.confirmPassword) {
      return false;
    } else {
      this.confirmPassError = '';
      return true;
    }
  }

  cognitoCallback(message: string, result: any) {
    if (message !== null) { // AWS threw an error
      if (message.includes('email')) {
        this.emailError = message;
      } else {
        this.genericMessage = message;
      }

    } else { // success
        // move to the next page if the user is authenticated
        if (result.idToken.jwtToken) {
          this.router.navigate(['/home']);
        }
      }
  }
}
