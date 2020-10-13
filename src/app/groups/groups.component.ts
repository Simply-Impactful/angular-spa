import { User } from '../model/User';
import { Action } from '../model/Action';
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LoggedInCallback, CognitoUtil, Callback, CognitoCallback, ChallengeParameters } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Group } from '../model/Group';
import { Member } from '../model/Member';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';
import { LogInService } from '../services/log-in.service';
import { Parameters } from '../services/parameters';
import { UserPermission } from '../services/user-permission.service';
import { Router } from '@angular/router';
import { LevelsMapping } from '../shared/levels-mapping';
import { Levels } from '../model/Levels';
import * as _ from 'lodash';
import { ApiGatewayService } from '../services/api-gateway.service';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupsComponent implements OnInit, CognitoCallback, LoggedInCallback, Callback {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private conf = AppConf;

  dataSource;
  columnsToDisplay = ['name', 'leader', 'createdDate', 'totalPoints', 'zipCode', 'joinGroup', 'deleteGroup'];
  groups: Group[];
  isExpanded: boolean = false;
  isCollapsed: boolean = true;
  username: string = '';
  user: User;
  isNotGroupMember: {};
  groupToDelete: Group;
  groupToJoin: Group;
  cognitoUsersResponse = [];
  level: Levels;
  users: User[];

  constructor(
    public lambdaService: LambdaInvocationService, public cognitoUtil: CognitoUtil,
    public loginService: LogInService, public router: Router, public levelsData: LevelsMapping,
    public userPermission: UserPermission, public apiService: ApiGatewayService) { }

  ngOnInit() {
    this.loginService.isAuthenticated(this);
    this.isNotGroupMember = {};
    // get the users' data - total points of each user
    this.apiService.listUserActions(this);

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // only for group leaders
  deleteGroup(group: Group) {
    this.groupToDelete = group;
    this.apiService.deleteGroup(this, group);
  }

  // only for non-group members
  joinGroup(group: Group) {
    this.groupToJoin = group;
    group.membersString = this.username;
    group.username = group.leader;
    const groupArray = [];
    groupArray.push(group);
    this.apiService.createGroup(groupArray, this);
  }

  // only for group members - NEEDS TESTING
  /**  leaveGroup(group: Group) {
      // find the location of the user to remove
      for (let i = 0; i < group.members.length; i ++) {
        if (group.members[i].member === this.username) {
          group.members.splice(i);
        }
      }
      group.membersString = JSON.stringify(group.members);
      group.username = group.leader;
      group.pointsEarned = group.totalPoints;
      const groupArray = [];
      this.groupToJoin = group;
      groupArray.push(group);
      // TODO: need to make the membre inactive
   //   this.lambdaService.createGroup(groupArray, this);
    }  **/

  expand() {
    this.isExpanded = true;
    this.isCollapsed = false;
  }
  collapse() {
    this.isCollapsed = true;
    this.isExpanded = false;
  }

  isLoggedIn(message: string, loggedIn: boolean): void {
    if (loggedIn) {
      this.username = this.cognitoUtil.getCurrentUser().getUsername();
      this.apiService.getAllGroups(this);
    } else {
      const currentUser = this.cognitoUtil.getCurrentUser();
      this.router.navigate(['/landing']);
      currentUser.signOut();
    }
  }

  // response of listUserActions API - LoggedInCallback Interface
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      // const response = JSON.parse(result);
      const unique = _.uniqBy(result, 'username');
      this.users = unique;
      this.levelsData.getAllData();
    } else {
      this.apiService.listUserActions(this);
    }
  }

  /** handles the response of Delete API
  callbackWithParams(error: AWSError, result: any) {
    if (result ) {
      // TODO: call getGroups to refresh screen data?
    } else {
        if (error) {
          if (error.toString().includes('credentials')) {
            // RETRY
            this.deleteGroup(this.groupToDelete);
          }
        }
      console.log('error deleting group ' + error);
    }
  } **/

  // Response of get All Groups - Callback interface
  cognitoCallbackWithParam(result: any) {
    if (result) {
      const response = result;
      this.groups = response;
      this.dataSource = new MatTableDataSource(this.groups);
      this.dataSource.paginator = this.paginator;

      // logic to find if the logged in user is already a member of a group
      let isFound: boolean = false;
      this.groups.forEach(group => {
        isFound = false;
        group.members.forEach(member => {
          if ((member as Member).member === this.username) {
            isFound = true;
          }
        });
        this.isNotGroupMember[group.name.toString()] = !isFound;
      });
      // get the members data
      this.listUsers();

    } else {
      console.log('unnexpected error occurred - could not get get all groups');
    }
  }

  listUsers() {
    // calls the cognito Util to get all of the cognito users
    this.cognitoUtil.listUsers().then(response => {
      this.cognitoUsersResponse = response;
      if (typeof this.users === 'undefined') {
        const unique = _.uniqBy(response, 'Username');
        this.users = unique;
      }
      // build out the members data for each group
      for (let i = 0; i < this.groups.length; i++) {
        this.getAttributesForUsers(this.groups[i], this.cognitoUsersResponse);
        this.getMembersLevels(this.groups[i]);
      }
    });
  }

  getAttributesForUsers(group: Group, cognitoResponse: any[]): void {
    // cross-check the cognito users and map the data for each member of the group passed in
    cognitoResponse.map((members) => {
      for (let i = 0; i < group.members.length; i++) {
        if (group.members[i].member === members.Username) {
          for (let j = 0; j < members.Attributes.length; j++) {
            // if they don't have a picture, assign them the default
            // if they do have a picture in cognito, assing it to their member object
            // TODO: May not have to do this if we assign a default one on creation
            if (members.Attributes[j]['Name'] !== 'picture') {
              group.members[i].picture = this.conf.default.userProfile;
            }
            if (members.Attributes[j]['Name'] === 'picture') {
              group.members[i].picture = members.Attributes[j]['Value'];
            }
          }
        }
      }
    });
  }

  getMembersLevels(group: Group) {
    for (let i = 0; i < group.members.length; i++) {
      for (let j = 0; j < this.users.length; j++) {
        if (this.users[j].username === group.members[i].member) {
          group.members[i].totalMemberPoints = this.users[j].totalPoints;
        }
      }
      group.members[i] = this.levelsData.getMembersLevels(group, i);
    }
  }

  // Logged In Callback interface
  callbackWithParameters(error: AWSError, result: any) { }

  // CognitoCallback Interface - response of create group API - join group
  cognitoCallback(message: string, result: any) {
    if (result) {
      console.log('user successfully modified');
      // no longer 'not a group member'
      this.isNotGroupMember[this.groupToJoin.name.toString()] = false;
      // call to refresh the data
      this.apiService.getAllGroups(this);
    } else {
      if (message.includes('credentials')) {
        this.joinGroup(this.groupToJoin);
      } else {
        console.log('unnexepected error occurred - could not join group: ' + message);
      }
    }
  }

  handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void { }

  callback() { }
}
