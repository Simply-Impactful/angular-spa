import { Component, OnInit } from '@angular/core';
import { AWSError } from 'aws-sdk';
import { Group } from '../model/Group';
import { Member } from '../model/Member';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { CognitoUtil, Callback } from '../services/cognito.service';
import { User } from '../model/User';
import { AppConf } from '../shared/conf/app.conf';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit, Callback {

  private conf = AppConf;
  groups = new Array<Group>();
  myGroups = [];
  user: User;
  topThree = [];

  constructor(
    public lambdaService: LambdaInvocationService, public cognitoUtil: CognitoUtil) { }

  ngOnInit() {
    console.log('my groups ');
   this.lambdaService.getAllGroups(this);
  }

  // response of getAllGroups - Callback interface
  cognitoCallbackWithParam(result: any) {
    if (result) {
      if (result.toString().includes('CredentialsError')) {
        // if auth error - retry
        console.log('my groups credentials error.. RETRYING');
        this.lambdaService.getAllGroups(this);
      } else {
        const response = JSON.parse(result);
         // no error
         const filteredGroups = [];
         this.groups = response.body;
         const username = this.cognitoUtil.getCurrentUser().getUsername();
         // display only groups the logged in user is a member of
         for (let i = 0; i < this.groups.length; i++) {
           if (!this.groups[i].groupAvatar) {
             this.groups[i].groupAvatar = this.conf.default.userProfile;
           }
           for (let j = 0; j < this.groups[i].members.length; j++) {
             if ( this.groups[i].members[j]['member'] === username) {
               this.myGroups.push(this.groups[i]);
             }
           }
         }
       }
    }
  }

  callback() {}
  callbackWithParam(result: any) {}
  callbackWithParameters(error: AWSError, result: any) {}
}
