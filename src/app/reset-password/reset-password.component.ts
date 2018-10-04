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
  username: string = '';
  verificationCode: string = '';
  unsent: boolean = true;
  sent: boolean = false;
  onConfirm: boolean = false;
  user: User;

  constructor(
    private router: Router,
    private cognitoUtil: CognitoUtil,
    private loginService: LogInService,
    private params: Parameters) { }

  ngOnInit() {
  }

   // step 1 of forgotPassword flow.. getting a new verification code
   sendCode() {
    this.loginService.forgotPassword(this.username, this);
  }

  // step 2 is resetting the password
  resetPassword() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'The inputted passwords do not match.';
    } else {
      this.onConfirm = true;
      this.loginService.confirmNewPassword(this.username, this.verificationCode, this.password, this);
    }
  }

  cognitoCallback(message: string, result: any) {
    if (message !== null) {
      this.errorMessage = message;
      console.log('message: ' + this.errorMessage);
    } else {
      this.unsent = false;
      this.sent = true;
      // Doing this because call back is being used for both calls,
      // but only want to route on the second call
      if (this.onConfirm) {
          // move to the next step
          this.router.navigate(['/home']);
      }
    }
  }
}
