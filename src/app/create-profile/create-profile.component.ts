import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoUtil, Callback, CognitoCallback, LoggedInCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { User } from '../model/User';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';
import { AWSError } from 'aws-sdk';
import { LogInService } from '../services/log-in.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit, CognitoCallback, OnDestroy, LoggedInCallback {
  newUser = new User();
  conf = AppConf;
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
  isGenericMessage: boolean = null;
  profilePicture: any;
  focused: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public cognitoUtil: CognitoUtil,
    public createProfileService: CreateProfileService,
    private s3: S3Service, private loginService: LogInService) {
    const errorMessage = this.errorMessage;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.newUser.userType = params['userType']; // (+) converts string 'id' to a number
    });
    const currentPage = this.route.component.valueOf();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  createAccount() {
    if (this.checkInputs()) {
      this.createProfileService.register(this.newUser, this);
      // TODO: should we collect the pic else where?
      console.log(this.conf.imgFolders.userProfile);
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
      this.confirmPassError = '';
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
    const loginService = new LogInService(this.cognitoUtil);
    if (message !== null) { // AWS threw an error
      if (message.toString().includes('CredentialsError')) {
        // retry due to caching previous logged in User
        loginService.authenticate(this.newUser.username, this.newUser.password, this);
      } else {
        if (message.includes('email')) {
          this.emailError = message;
        } else {
          this.genericMessage = message;
          console.log('generic message ' + this.genericMessage);
          this.isGenericMessage = true;
        }
      }
    } else { // success
      // move to the next page if the user is authenticated
      if (result.idToken.jwtToken) {
        // if nothing was uploaded, provide the user the default image
        if (!this.profilePicture) {
          this.newUser.picture = this.conf.default.userProfile;
          this.cognitoUtil.updateUserAttribute(this, 'picture', this.newUser.picture);
        } else { // needs to be uploaded otherwise
          this.s3.uploadFile(this.profilePicture, this.conf.imgFolders.userProfile, (err, location) => {
            if (err) {
              // we will allow for the creation of the item, we will just not have an image
              console.log('err on upload ' + err);
              this.newUser.picture = this.conf.default.userProfile;
            } else {
              this.newUser.picture = location;
              this.cognitoUtil.updateUserAttribute(this, 'picture', this.newUser.picture);
            }
          });
        }
      }
    }
  }

  callbackWithParams(error: AWSError, result: any) {}
  isLoggedIn(message: string, loggedIn: boolean) {}
  callbackWithParam(result: any) {
    console.log('result of update user after creating profile...' + result);
    this.router.navigate(['/home']);
  }

  fileEvent(fileInput: any) {
    // save the image file which will be submitted later
    this.profilePicture = fileInput.target.files[0];
  }
}
