import { Component, OnInit } from '@angular/core';
import { CreateProfileService } from '../services/create-profile.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-sign-up',
  templateUrl: './confirm-sign-up.component.html',
  styleUrls: ['./confirm-sign-up.component.scss']
})
export class ConfirmSignUpComponent implements OnInit {

  verificationCode: string = '';
  username: string = '';
  errorMessage: string = '';
  private sub: any;
  inputUsername: string = '';

  constructor(public createProfileService: CreateProfileService, public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.username = params['username'];

    });
  }

  confirmVerificationCode() {
    this.createProfileService.confirmVerificationCode(this.username, this.verificationCode, this);
  }

  resendCode(){
    this.createProfileService.resendCode(this.inputUsername, this);
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) {
      this.errorMessage = message;
      console.log('message: ' + this.errorMessage);
    } else {
      // move to the next step
      this.router.navigate(['/home']);
    }
  }

}
