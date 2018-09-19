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
 // newUser: User;
  newUser = new User();
  errorMessage: string;
  private sub: any;
  callback: Callback;
  confirmPassword: string;
  genericMessage: string;

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
  }

  isPasswordValid(): boolean {
    const password = this.newUser.password;
    // Confirm they match
    if (password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.sub) {
    this.sub.unsubscribe();
    }
  }

  createAccount() {
    if (this.newUser.password !== null && this.isPasswordValid()) {
      this.createProfileService.register(this.newUser, this);
    } else {
      this.errorMessage = 'Password must not be empty';
    }
  }

  cognitoCallback(message: string, result: any) {
    if (message !== null) { // AWS threw an error
      this.errorMessage = message;
      if (message.endsWith('questions')) {
        this.errorMessage = '';
        this.genericMessage = message;
        console.log(this.genericMessage);
      }
    } else { // success
        // move to the next step
        this.router.navigate(['/home']);
      }
  }
}
