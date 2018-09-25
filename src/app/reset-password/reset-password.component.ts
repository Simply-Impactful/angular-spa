import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil } from '../services/cognito.service';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { User } from '../model/User';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  email: string = '';
  verificationCode: string = '';
  resent: boolean = false;
  onConfirm: boolean = false;
  user: User;
  valid: any;
  securityQuestion1: string = '';
  securityQuestion2: string = '';
  securityQuestion3: string = '';
  securityAnswer1: string = '';
  securityAnswer2: string = '';
  securityAnswer3: string = '';

  constructor(
    private router: Router,
    private cognitoUtil: CognitoUtil,
    private loginService: LogInService,
    private params: Parameters) { }

  ngOnInit() {
  }

   // step 1 of forgotPassword flow.. getting a new verification code
  validateAnswers() {
    this.loginService.forgotPassword(this.email, this);
  }

  // step 2 is resetting the password
  resetPassword() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'The inputted passwords do not match.';
    } else {
      this.onConfirm = true;
      this.loginService.confirmNewPassword(this.email, this.verificationCode, this.password, this);
    }
  }

  cognitoCallback(message: string, result: any) {
    if (message !== null) {
      this.errorMessage = message;
      console.log('message: ' + this.errorMessage);
    } else {
      this.resent = true;
      // Doing this because call back is being used for both calls,
      // but only want to route on the second call
      if (this.onConfirm) {
          // move to the next step
          this.router.navigate(['/home']);
      }
    }
  }
}
