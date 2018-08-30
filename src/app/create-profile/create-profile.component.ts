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
export class CreateProfileComponent implements OnInit, CognitoCallback {
  newUser: NewUser
  errorMessage: string;
  userType: any;
  private sub: any;
  callback: Callback;
  confirmPassword: string;

  constructor(private route: ActivatedRoute, public router: Router, public cognitoUtil: CognitoUtil, public createProfileService: CreateProfileService) {
    let errorMessage = this.errorMessage;
  }

  ngOnInit() {
    this.newUser = new NewUser();
    this.sub = this.route.params.subscribe(params => {
       this.userType = params['userType']; // (+) converts string 'id' to a number

       // In a real app: dispatch action to load the details here.
    });
  }

  checkPasswords():boolean{
    var password = this.newUser.password;
      // Determine if the password is 8 characters long...
      if(password.length>=8){
        // Confirm they match
        if(password != this.confirmPassword){
          this.errorMessage="Passwords do not match";
          console.log(this.errorMessage + " password " + password + "confirm Password " + this.confirmPassword);
          return false;
        }
        // they match, so check if it has a special character and number
        else {
          if(this.hasSpecicalChar(password)){
            if(this.hasNumber(password)){
              return true;
            }
            else{
              this.errorMessage="Password is missing a number ";
              console.log(this.errorMessage + " password " + password);
              return false;
            }
          }
          else{
            this.errorMessage="Password is missing a special character";
            console.log(this.errorMessage + " password " + password);
            return false;
          }

        }
      }
    // password length is less than 8 chars
    else{
      this.errorMessage="Password must be 8 characters long";
      console.log(this.errorMessage);
      return false;
    }
  }

  hasSpecicalChar(password:string){        
    var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    var checkForSpecialChar = function(password){
    for(var i = 0; i < specialChars.length;i++){
        if(password.indexOf(specialChars[i]) > -1){
          console.log("Has a special character " + password);
            return true
        }
        else{
          return false;
        }
      }
    }
  }

  hasNumber(password:string){
    var numbers = "0123456789";
    var checkForNumber = function(password){
      for(var i = 0; i < numbers.length; i++){
        if(password.indexOf(numbers[i]) > -1){
          console.log("has number");
          return true;
        }
        else{
          return false;
        }
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createAccount(){
    var isValid = false;
    // check if password is null
    if(this.newUser.password != null){
      // confirm passwords are the same
      isValid = this.checkPasswords();
    }
    else{
      this.errorMessage="Password must not be empty";
      console.log(this.errorMessage);
    }
    if(isValid){
      this.router.navigate(['/home']);

      // if they match, try to register the user through the create profile service
     // this.createProfileService.register(this.newUser, this);

      this.getParameters(this.callback);
      var cognitoUtil = this.cognitoUtil;
      let userPool = cognitoUtil.getUserPool();
      console.log("userPool " + JSON.stringify(userPool));
      let currentUser = cognitoUtil.getCurrentUser();
      console.log("current user " + JSON.stringify(currentUser));
      let creds = cognitoUtil.getCognitoCreds();
      console.log("customer credentials " + JSON.stringify(creds));
    }
  }
   

  cognitoCallback(message: string, result: any) {
    if (message != null) { //error
        this.errorMessage = message;
        console.log("result: " + this.errorMessage);
    } else { //success
        //move to the next step
        console.log("redirecting");
        //this.router.navigate(['/home/confirmRegistration', result.user.username]);
    }
  }
  
  // might only be for the 'sign-in' flow?
  getParameters(callback: Callback) {
    let cognitoUser = this.cognitoUtil.getCurrentUser();
    console.log("cognito user " + JSON.stringify(cognitoUser));

    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
            if (err)
                console.log("UserParametersService: Couldn't retrieve the user");
            else {
                cognitoUser.getUserAttributes(function (err, result) {
                    if (err) {
                        console.log("UserParametersService: in getParameters: " + err);
                    } else {
                      console.log("get User Attributes result " + result);
                       // callback.callbackWithParam(result);
                    }
                });
            }

        });
    } else {
      //  callback.callbackWithParam(null);
    }
  
  }
}
