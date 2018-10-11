import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoUtil, Callback, CognitoCallback } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { User } from '../model/User';
import { S3Service } from '../services/s3.service';

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
  isGenericMessage: boolean = null;
  picture: any;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public cognitoUtil: CognitoUtil,
    public createProfileService: CreateProfileService,
    private s3: S3Service) {
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
    // if (this.picture) {
    //   const uploadFile = this.s3.uploadFile(this.picture, 'user');
    //   if (uploadFile) {
    //     uploadFile.subscribe(
    //         (data: any) => {
    //           this.newUser.picture = data.;
    //           this.createProfileService.register(this.newUser, this);
    //         },
    //         (error: any) => {
    //           console.log(error);
    //           this.newUser.picture = null;
    //           this.createProfileService.register(this.newUser, this);
    //         }
    //     );
    //   }
    // }
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
    // when the user indicates to create account, we need to call s3 and upload the image.
    // then save this imageUrl on this field and pass to cognito.
    // if (this.picture) {
    //   this.newUser.picture = this.picture;
    // }
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
        console.log('generic message ' + this.genericMessage);
        this.isGenericMessage = true;
      }

    } else { // success
        // move to the next page if the user is authenticated
        if (result.idToken.jwtToken) {
          this.router.navigate(['/home']);
        }
      }
  }

  fileEvent(fileInput: any, imageName) {
    // save the image file which will be submitted later
    this.picture = fileInput.target.files[0];
  }
}
