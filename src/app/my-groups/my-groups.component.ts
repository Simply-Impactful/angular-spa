import { Component, OnInit } from '@angular/core';
import { AWSError } from 'aws-sdk';
import { Group } from '../model/Group';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { CognitoUtil } from '../services/cognito.service';
import { User } from '../model/User';
import { JSONP_ERR_WRONG_METHOD } from '@angular/common/http/src/jsonp';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {

  groups = new Array<Group>();
  myGroups = [];
  user: User;

  constructor(
    public lambdaService: LambdaInvocationService, public cognitoUtil: CognitoUtil) { }

  ngOnInit() {
   this.lambdaService.getAllGroups(this);
  }

  isLoggedIn(message: string, loggedIn: boolean): void {}

  // response of lamdba list Actions API call
  callbackWithParams(error: AWSError, result: any): void {
    const response = JSON.parse(result);
    this.groups = response.body;

    const username = this.cognitoUtil.getCurrentUser().getUsername();

    // display only groups the logged in user is a member of
    for (let i = 0; i < this.groups.length; i++) {
      for (let j = 0; j < this.groups[i].members.length; j++) {
        if ( this.groups[i].members[j]['member'] === username) {
          this.myGroups.push(this.groups[i]);
        }
      }
    }
    for (let i = this.myGroups.length - 1; i > 3; i--) {
      this.myGroups[i]['members'].pop();
    }
    console.log('myGroups ' + JSON.stringify(this.myGroups));
  }

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {}
}
