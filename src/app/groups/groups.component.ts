import { User } from '../model/User';
import { Action } from '../model/Action';
import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { LoggedInCallback, CognitoUtil, Callback, CognitoCallback, ChallengeParameters } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Group } from '../model/Group';
import { Member } from '../model/Member';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';
import { LogInService } from '../services/log-in.service';
import { Parameters } from '../services/parameters';
import { Router } from '@angular/router';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupsComponent implements OnInit, CognitoCallback, LoggedInCallback, Callback {
  @ViewChild(MatSort) sort: MatSort;
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

  constructor(
    public lambdaService: LambdaInvocationService, public cognitoUtil: CognitoUtil,
      public loginService: LogInService, public router: Router) {}

  ngOnInit() {
    this.loginService.isAuthenticated(this);
    this.isNotGroupMember = {};
  }

  // only for group leaders
  deleteGroup(group: Group) {
    this.groupToDelete = group;
    this.lambdaService.deleteGroup(this, group);
  }

  // only for non-group members
  joinGroup(group: Group) {
    this.groupToJoin = group;
    group.membersString = this.username;
    group.username = group.leader;
    const groupArray = [];
    groupArray.push(group);
    this.lambdaService.createGroup(groupArray, this);
  }
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
      this.lambdaService.getAllGroups(this);
    } else {
      const currentUser = this.cognitoUtil.getCurrentUser();
      this.router.navigate(['/landing']);
      currentUser.signOut();
    }
  }

  // handles the response of Delete API
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
  }

  // Response of get All Groups - Callback interface
  cognitoCallbackWithParam(result: any) {
    if (result) {
      if (result.includes('credentials')) {
        // retry
        this.lambdaService.getAllGroups(this);
      } else {
        const response = JSON.parse(result);
        this.groups = response.body;
        this.dataSource = new MatTableDataSource(this.groups);
        this.dataSource.paginator = this.paginator;
        // un-used as of now..
        this.dataSource.sort = this.sort;

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
      }
    } else {
      console.log('unnexpected error occurred - could not get get all groups');
    }

    /**
     * this.dataSource.sortingDataAccessor = (item, property) => {

      let newItem;
      if (item.element !== undefined) {
        newItem = item.element;
        } else {
        newItem = item;
        }
      console.log(this.tempElementData);
      let foundElement;
      if (item.element !== undefined) {
        foundElement = this.tempElementData.find(i => i.element !== undefined && item.element.name === i.element.name);
        } else {
        foundElement = this.tempElementData.find(i => item.name === i.name);
      }
      const index = this.tempElementData.indexOf(foundElement);
      console.log('foundElement: ' + JSON.stringify(item) + ' '  + +index);
      return +index;
    }; **/
    // TODO: implement..
  }

  listUsers() {
    // calls the cognito Util to get all of the cognito users
    this.cognitoUtil.listUsers().then(response => {
      this.cognitoUsersResponse = response;
      // build out the members data for each group
      for (let i = 0; i < this.groups.length; i++) {
        this.getAttributesForUsers(this.groups[i], this.cognitoUsersResponse);
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

   // Logged In Callback interface
   callbackWithParameters(error: AWSError, result: any) {}

  // CognitoCallback Interface - response of create group API - join group
  cognitoCallback(message: string, result: any) {
    if (result) {
      console.log('user successfully added');
      // no longer 'not a group member'
      this.isNotGroupMember[this.groupToJoin.name.toString()] = false;
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
  callbackWithParam(result: any): void {}

  callback() {}
}
