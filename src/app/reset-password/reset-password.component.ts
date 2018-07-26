import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  password: string = "";

  constructor() { 
  }

  ngOnInit() {
    console.log("reset password component");
  
  }
  save(){
    //update the password details in the DB.. make a call to the backend here.
    // this.password is the parameter to pass
  }


}
