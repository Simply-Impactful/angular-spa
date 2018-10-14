import { User } from './../model/User';
import { Action } from '../model/Action';
import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { LoggedInCallback, CognitoUtil, Callback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Group } from '../model/Group';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';

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
export class GroupsComponent implements OnInit, LoggedInCallback, Callback {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private conf = AppConf;

  dataSource;
  columnsToDisplay = ['name', 'leader', 'createdDate', 'totalPoints', 'zipCode', 'joinGroup'];
  groups: Group[];
  isExpanded: boolean = false;
  isCollapsed: boolean = true;
  defaultUserPicture = this.conf.default.userProfile;
  username: string = '';

  constructor(
    public lambdaService: LambdaInvocationService, public cognitoUtil: CognitoUtil) {}

  ngOnInit() {
    this.username = this.cognitoUtil.getCurrentUser().getUsername();
    this.lambdaService.getAllGroups(this);
  }


  joinGroup(group: Group) {
    const updateList = [];
    const memberObj = {
      member: this.username
    };
    group.members.push(memberObj);

    for (let i = 0; i < group.members.length; i++) {
      updateList.push(group.members[i]['member']);
    }
    group.groupMembers = updateList.toString();

    this.lambdaService.createGroup(group, this);
  }

  expand() {
    this.isExpanded = true;
    this.isCollapsed = false;
  }
  collapse() {
    this.isCollapsed = true;
    this.isExpanded = false;
  }

  // Response of get All Groups - Callback interface
  cognitoCallbackWithParam(result: any) {
    const response = JSON.parse(result);
    this.groups = response.body;
    this.dataSource = new MatTableDataSource(this.groups);
    this.dataSource.paginator = this.paginator;

    // un-used as of now..
    this.dataSource.sort = this.sort;

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

   // Logged In Callback interface
   callbackWithParameters(error: AWSError, result: any) {
    // TODO: implement..
  }

  callbackWithParams(error: AWSError, result: any): void {}

  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {}

  isLoggedIn(message: string, loggedIn: boolean): void {}

  callback() {}
}
