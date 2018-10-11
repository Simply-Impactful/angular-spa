import { Component, OnInit } from '@angular/core';
import { Group } from '../model/Group';
import * as AWS from 'aws-sdk/global';
import { environment } from '../../environments/environment';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoCallback, LoggedInCallback } from '../services/cognito.service';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk/global';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { S3Service } from '../services/s3.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit, LoggedInCallback {

  types = [];
  subTypes = [];
  groupsData = new Array<Group>();
  createdGroup: Group;
  i: number = 0;
  isOther: boolean = false;
  groupControl = new FormControl();
  noSubTypes = [];
  membersError: string = '';
  groupAvatarFile: any;
  groupAvatarUrl: string;

  constructor(public lambdaService: LambdaInvocationService,
              public router: Router,
              private s3: S3Service) { }

  ngOnInit() {
    this.createdGroup = new Group();
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

  creategroup() {
    this.createdGroup.groupAvatar = this.groupAvatarUrl;
    // if (this.groupAvatarFile) {
      // this.s3.uploadFile(this.groupAvatarFile);
      // return the location, like: Location:"https://simply-impactful-image-data.s3.amazonaws.com/images/curazao-1.jpg"
    // }
    if (this.createdGroup.groupMembers != null) {
      // trim any spaces in between
      this.createdGroup.groupMembers = this.createdGroup.groupMembers.replace(/\s+/g, '');
      this.lambdaService.createGroup(this.createdGroup, this, 'create');
      window.location.reload();
      this.router.navigate(['/home']);
    } else {
      this.membersError = 'You must enter at least one group member. Consider adding yourself';
    }
  }

  isLoggedIn(message: string, loggedIn: boolean): void {}

  // result of lambda listActions and Delete Actions API
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
      this.groupsData = response.body;
      this.types = this.groupsData;
 //     console.log('groupsData ' + JSON.stringify(this.groupsData));
      // iterate between both arrays to pull out the subTypes which have 'N/A' specified
      for (let i = 0; i < this.groupsData.length; i++) {
        for (let j = 0; j < this.groupsData[i].subType.length; j++) {
          if (this.groupsData[i].subType[j]['subType'] === 'N/A') {
            // add a noSubTypes array so we can display them as top level options
            this.noSubTypes.push(this.groupsData[i].type);
            // splice pulls the subType out of the array that we set back to this.groupsData
            this.types.splice(i, 1);
          }
        }
      }
      this.noSubTypes.push('Other');
      // the final array to display
       this.groupsData = this.types;
    } else {
      console.log('error ' + JSON.stringify(error));
    }
  }
  callbackWithParam(result: any): void {}

  fileEvent(fileInput: any) {
    // save the image file which will be submitted later
    this.groupAvatarFile = fileInput.target.files[0];
    // this.s3.uploadFile(this.groupAvatarFile);
    // console.log(this.groupAvatarFile);
  }

}
