import { Component, OnInit } from '@angular/core';
import { LogInService } from '../services/log-in.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  username: string = "";
  password: string = "";

  constructor(public logInService: LogInService) { }

  ngOnInit() {

  }

  login(){
    // A service call will be made here to validate the credentials against what we have stored in the DB
    this.logInService.login(this.username, this.password).subscribe(
      user=>{
        if(user.isLoggedIn){
          console.log("is logged in");
        }
      });
  }
}
