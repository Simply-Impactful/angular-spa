import { Component, OnInit,  OnDestroy } from '@angular/core';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, Callback, CognitoCallback, LoggedInCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConf } from '../shared/conf/app.conf';
import { S3Service } from '../services/s3.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, LoggedInCallback, Callback {
  private conf = AppConf;
  user: User;
  isEditProfile: Boolean = false;
  isViewProfile: Boolean = true;
  updatedUser = new User();
  errorMessage: string = '';
  profilePicture: any;
  genericMessage: string;
  emailError: string = '';
  isGenericMessage: boolean = null;
  isUploadImage: boolean = false;
  isProfileUpdated: boolean = false;

  constructor(
    private loginService: LogInService,
    private cognitoUtil: CognitoUtil,
    private params: Parameters, private lambdaService: LambdaInvocationService,
    public router: Router,
    public createProfileService: CreateProfileService,
    private s3: S3Service) { }

  ngOnInit() {
   this.params.user$.subscribe(user => {
      this.user = user;
    });
    this.loginService.isAuthenticated(this);
   }

  /** Interface needed for LoggedInCallback */
  isLoggedIn(message: string, isLoggedIn: boolean) {}

  // API Response for any lambda calls
  callbackWithParams(error: AWSError, result: any) {
    if (error) {
      this.errorMessage = error.message;
    }
  }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {
    console.log('result in userProfile isAuth response ' + JSON.stringify(result));
    if (result) {
      const cognitoUser = this.cognitoUtil.getCurrentUser();
      const params = new Parameters();
      this.user = params.buildUser(result, cognitoUser);
      this.lambdaService.getUserActions(this, this.user);
    }
   }

   // Response of getUserActions API - callback interface
   callbackWithParameters(error: AWSError, result: any) {
      if (result) {
        const response = JSON.parse(result);
        const userActions = response.body;
        const userActionsLength = userActions.length;
          for ( let i = 0; i < userActionsLength; i++ ) {
            if (userActions[i].totalPoints) {
              this.user.totalPoints = userActions[i].totalPoints;
            } else {
              this.user.totalPoints = 0;
            }
        }
      }
   }

   // for switching back and forth between edit and read mode
   editProfile() {
    this.isViewProfile = false;
    this.isEditProfile = true;
  }
  // save and switch mode back to view
  saveChanges() {
    if (this.isUploadImage) {
        console.log(this.isUploadImage);
        this.uploadAndSend();
    } else {
      for (const key of Object.keys(this.updatedUser)) {
        if (this.updatedUser[key]) {
          this.cognitoUtil.updateUserAttribute(this, key, this.updatedUser[key]);
        }
      }
    }
    // TODO: can this be done more seemlessly?
  }
  uploadAndSend() {
      if (this.profilePicture) {
        this.s3.uploadFile(this.profilePicture, this.conf.imgFolders.userProfile, (err, location) => {
          if (err) {
            // we will allow for the creation of the item, we will just not have an image
            console.log(err);
            this.updatedUser.picture = this.user.picture;
            this.isProfileUpdated = true;
          } else {
            this.updatedUser.picture = location;
            this.isProfileUpdated = true;
            for (const key of Object.keys(this.updatedUser)) {
              if (this.updatedUser[key]) {
                this.cognitoUtil.updateUserAttribute(this, key, this.updatedUser[key]);
              }
            }
          }
        });
      }
    }

  fileEvent(fileInput: any) {
    // save the image file which will be submitted later
    this.profilePicture = fileInput.target.files[0];
    this.isUploadImage = true;
  }

  callback() {}
  cognitoCallbackWithParam(result: any) {}
}
