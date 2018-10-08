import { Component, OnInit } from '@angular/core';
import { CreateGroupService } from '../services/creategroup.service';
import { Group } from '../model/Group';
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
// import { CognitoIdentityServiceProvider } from '../services/cognito.service';
import * as AWS from 'aws-sdk/global';
import { environment } from '../../environments/environment';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoCallback, LoggedInCallback } from '../services/cognito.service';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk/global';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit, LoggedInCallback {

 // groups = [];
  types = [];
  subTypes = [];
  groupsData = new Array<Group>();
  createdGroup: Group;
  i: number = 0;
  isOther: boolean = false;
  groupControl = new FormControl();
  value: string = '';
  name: string = '';
  noSubTypes = [];

  constructor(private createGroupService: CreateGroupService, public lambdaService: LambdaInvocationService) { }

  ngOnInit() {
    this.createdGroup = new Group();
  /**  const result = [
      {
        createdDate: 1538510499536,
        subType: [],
        type: 'NoSubCategory',
        updatedAt: 1538510499536
      },
      {
          createdDate: 1538510499536,
          subType: ['SubType1', 'Subtype2'],
          type: 'Non-Profit',
          updatedAt: 1538510499536
      },
      {
        createdDate: 15385104996636,
        subType: [],
        type: 'Nonsub',
        updatedAt: 1538510499536
      },
      {
        createdDate: 1538510499536,
        subType: ['Entire Company'],
        type: 'Profit',
        updatedAt: 1538510499536
      },
      {
        createdDate: 1538510499536,
        subType: [],
        type: 'Other',
        updatedAt: 1538510499536
      },
      {
        createdDate: 1538510499536,
        subType: ['Testing'],
        type: 'Sub',
        updatedAt: 1538510499536
      }];
      this.groupsData = result;
      this.types = result;
      console.log('this.groupsData.length ' + this.groupsData.length);
      for (let i = 0; i < this.groupsData.length; i++) {
        if (this.groupsData[i].subType.length === 0) {
          this.noSubTypes.push(this.groupsData[i].type);
          this.types.splice(i, 1);
        }
      }
       this.groupsData = this.types;**/
    this.lambdaService.listGroupsMetaData(this);
  }

  toggleOption(type: string, subtype: string) {
    this.createdGroup.type = type;
    if (this.createdGroup.type === 'Other') {
      this.isOther = true;
    } else {
      this.isOther = false;
    }
  }

  addMember() {}

  creategroup() {
    // A service call will be made here to validate the credentials against what we have stored in the DB
    this.createGroupService.createGroup(this.createdGroup).subscribe();
  }

  isLoggedIn(message: string, loggedIn: boolean): void {}

  // result of lambda listActions and Delete Actions API
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
   //   console.log('result');
      const response = JSON.parse(result);
      this.groupsData = result;
    } else {
      console.log('error ' + JSON.stringify(error));
    }
  }
  callbackWithParam(result: any): void {}

}
