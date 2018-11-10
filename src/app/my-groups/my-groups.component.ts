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

  getAttributesForUser(groupMember: Member[], cognitoResponse: any[]) {
    cognitoResponse.map((members) => {
      const match = groupMember.find((member) => {
        return true;
      });
      if (match.member === members.Username) {
        for (let i = 0; i < members.Attributes.length; i++) {
          if (members.Attributes[i]['Name'] === 'picture') {
            this.picture = members.Attributes[i]['Value'] ;
          }
        }
      }
    });
    // if the user doesn't have a picture, assign them the default
    // may not be necessary if we already do this on create
    // TODO: confirm above assumption
    if (!this.picture) {
      this.picture = this.conf.default.userProfile;
    }
    return this.picture;
  }


  listUsers() {
    this.cognitoUtil.listUsers().then(response => {
      this.cognitoUsersResponse = response;
      for (let i = 0; i < this.myGroups.length; i++) {

        for (let j = 0; j < this.myGroups[i].groupMembers.length; j++) {
          const mems = this.myGroups[i]['groupMembers'];
          this.myGroups[i].groupMembers[j].picture = this.getAttributesForUser(mems, this.cognitoUsersResponse);
        }
      }
  //    let attributes: CognitoUserAttribute[];
   //   attributes = this.cognitoUsersResponse[0].Attributes;
 //     const property = attributes[0].getName();
  //  console.log('attributes of first user ' + JSON.stringify(attributes[0]['Name']));
 //     const property = attributes[0].getName();
    //  console.log('first property ' + property);
 //     console.log('this.cogntioResponse ' + JSON.stringify(this.cognitoUsersResponse[0].Attributes['picture']));
   //   this.myGroups[0].groupMembers[0].picture = '123';
/**      for (let i = 0; i < this.myGroups.length; i++) {
        for (let j = 0; j < this.cognitoUsersResponse.length; j++) {
          console.log('this.myGroups[i].groupMembers[i] ' + JSON.stringify(this.myGroups[i].groupMembers[i]));
          if (this.myGroups[i].groupMembers[i] === this.cognitoUsersResponse[j].Username) {
            console.log('match');
          }
        }
      } **/
   //   const picture = this.getAttributesForUser([{ member: 'eahendricks6', pointsEarned: 0, picture: '123' }]);
     // console.log('picture ' + picture);
    });

  // console.log('index ' + username);
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
         this.listUsers();
       }
    }
  }

  callback() {}
  callbackWithParam(result: any) {}
  callbackWithParameters(error: AWSError, result: any) {}
}
