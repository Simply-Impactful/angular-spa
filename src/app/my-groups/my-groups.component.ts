import { Component, OnInit } from '@angular/core';
import { AWSError } from 'aws-sdk';
import { Group } from '../model/Group';
import { Member } from '../model/Member';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { CognitoUtil, Callback } from '../services/cognito.service';
import { User } from '../model/User';
import { AppConf } from '../shared/conf/app.conf';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Parameters } from '../services/parameters';
import * as _ from 'lodash';

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
  cognitoUsersResponse = [];
  members = new Array<Member> ();
  myGroupsObject = {};
  picture: String = '';
  defaultUserPicture = this.conf.default.userProfile;

  constructor(
    public lambdaService: LambdaInvocationService, public cognitoUtil: CognitoUtil, public params: Parameters) { }

  ngOnInit() {
   this.lambdaService.getAllGroups(this);
  }

  getAttributesForUsers(group: Group, cognitoResponse: any[]): void {
    // cross-check the cognito users and map the data for each member of the group passed in
    cognitoResponse.map((members) => {
      for (let i = 0; i < group.groupMembers.length; i++) {
        if (group.groupMembers[i].member === members.Username) {
          for (let j = 0; j < members.Attributes.length; j++) {
          // if they don't have a picture, assign them the default
          // if they do have a picture in cognito, assing it to their member object
            if (members.Attributes[j]['Name'] !== 'picture') {
              group.groupMembers[i].picture = this.conf.default.userProfile;
            }
            if (members.Attributes[j]['Name'] === 'picture') {
              group.groupMembers[i].picture = members.Attributes[j]['Value'];
            }
          }
        }
      }
    });
  }

  listUsers() {
    // calls the cognito Util to get all of the cognito users
    this.cognitoUtil.listUsers().then(response => {
      this.cognitoUsersResponse = response;
      // build out the members data for each group
      for (let i = 0; i < this.myGroups.length; i++) {
        this.getAttributesForUsers(this.myGroups[i], this.cognitoUsersResponse);
      }
    });
  }

  // response of getAllGroups - Callback interface
  cognitoCallbackWithParam(result: any) {
    this.members = [];
    if (result) {
      if (result.toString().includes('credentials')) {
        // if auth error - retry
        this.lambdaService.getAllGroups(this);
      } else {
        const response = JSON.parse(result);
         // no error
         const filteredGroups = [];
         this.groups = response.body;
         const username = this.cognitoUtil.getCurrentUser().getUsername();
         // set a default profile picture if the group doesn't have one
         for (let i = 0; i < this.groups.length; i++) {
           if (!this.groups[i].groupAvatar) {
             this.groups[i].groupAvatar = this.conf.default.groupAvatar;
           }
           for (let j = 0; j < this.groups[i].members.length; j++) {
             // if the user logged in is a memmber.. add the group to their list of groups
             if ( this.groups[i].members[j]['member'] === username) {
              // build an object to parse the build out the members and group data
               this.myGroupsObject = {
                 groupName: this.groups[i].name,
                 groupMembers: this.groups[i].members,
                 groupAvatar: this.groups[i].groupAvatar
               };
               this.myGroups.push(this.myGroupsObject);
             }
           }
         }
         // call the list users method in order to build out the memebrs data
         this.listUsers();
       }
    }
  }

  callback() {}
  callbackWithParam(result: any) {}
  callbackWithParameters(error: AWSError, result: any) {}
}
