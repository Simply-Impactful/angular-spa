import { Component, OnInit } from '@angular/core';
import { Group } from '../model/Group';
import * as AWS from 'aws-sdk/global';
import { environment } from '../../environments/environment';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoCallback, LoggedInCallback, Callback, ChallengeParameters } from '../services/cognito.service';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk/global';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';

let members;

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit, CognitoCallback, LoggedInCallback, Callback {

  FILES = {
    membersFile: 'membersFile',
    groupAvatarFile: 'groupAvatarFile'
  };
  groupArray = [];
  types = [];
  subTypes = [];
  groupsData = new Array<Group>();
  createdGroup;
  i: number = 0;
  isOther: boolean = false;
  groupControl = new FormControl();
  noSubTypes = [];
  membersError: string = '';
  namesError: string = '';
  zipcodeError: string = '';
  groupsLeaderError: string = '';
  groupTypeError: string = '';
  avatarError: string = '';
  groupAvatarFile: any;
  groupAvatarUrl: string;
  conf = AppConf;
  focused: boolean = false;
  membersFile: File;
  isFileReader: boolean;
  isGroupMembersDisable: boolean = false;

  constructor(public lambdaService: LambdaInvocationService,
    public router: Router,
    private s3: S3Service) { }

  ngOnInit() {
    this.isFileReader = true;
    this.createdGroup = new Array<Group>();
    this.lambdaService.listGroupsMetaData(this);
  }

  toggleOption(type: string, subtype: string) {
    this.createdGroup.groupType = type;
    // inputted string list
    this.createdGroup.groupSubType = subtype;
    if (!subtype) {
      this.createdGroup.groupSubType = 'N/A';
    }
    if (type === 'Other') {
      this.isOther = true;
      this.createdGroup.groupType = null;
    } else {
      this.isOther = false;
    }
  }

  creategroup() {
    // fresh new group needs points set to 0
    this.createdGroup.pointsEarned = 0;
    this.createdGroup.groupAvatar = this.groupAvatarUrl;
    if (this.checkInputs()) {
      // TODO: wouldn't this cause an issue if they input 2 names?
      this.createdGroup.membersString = this.createdGroup.membersString.replace(/\,+/g, ' ');
      this.s3.uploadFile(this.groupAvatarFile, this.conf.imgFolders.groups, (err, location) => {
        if (err) {
          // we will allow for the creation of the item, we have a default image
          console.log(err);
          this.createdGroup.groupAvatar = this.conf.default.groupAvatar;
        } else {
          this.createdGroup.groupAvatar = location;
        }
         // EXPECTS an array
         this.groupArray.push(this.createdGroup);
         this.lambdaService.createGroup(this.groupArray, this);
         // TODO: can we do this without a window reload?
         this.router.navigate(['/home']);
      //   window.location.reload();
      });
    }
  }

  checkInputs() {
    if (!this.createdGroup.membersString) {
      this.membersError = 'You must enter at least one group member. Consider adding yourself';
    } else {
      this.membersError = '';
    }
    if (!this.createdGroup.name) {
      this.namesError = 'Group name is required';
    } else {
      this.namesError = '';
    }
    if (!this.createdGroup.zipCode) {
      this.zipcodeError = 'Zipcode is required';
    } else {
      this.zipcodeError = '';
    }
    if (!this.createdGroup.groupType) {
      this.groupTypeError = 'Group Type is required';
    } else {
      this.groupTypeError = '';
    }
    if (!this.createdGroup.username) {
      this.groupsLeaderError = 'Group Leader username is required';
    } else {
      this.groupsLeaderError = '';
      return true;
    }
  }

  isLoggedIn(message: string, loggedIn: boolean): void { }

  // result of listGroupsMetaData - loggedInCallback interface
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
      this.groupsData = response.body;
      this.types = this.groupsData;
      console.log('this.groupsData ' + JSON.stringify(this.groupsData));
      // console.log('groupsData ' + JSON.stringify(this.groupsData));
      // iterate between both arrays to pull out the subTypes which have 'N/A' specified
      for (let i = 0; i < this.groupsData.length; i++) {
        for (let j = 0; j < this.groupsData[i].subType.length; j++) {
          // subType is used as an array in the response
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

  // Response of createGroup API - Callback interface
  cognitoCallbackWithParam(result: any) {}

  fileEvent(fileInput: any, fileName: string) {
    this[fileName] = fileInput.target.files[0];
    if (this[fileName] && fileName === this.FILES.membersFile) {
      this.getAsText(fileInput.target.files[0]);
      this.isGroupMembersDisable = true;
    } else if (!this[fileName] && this.isGroupMembersDisable) {
      this.isGroupMembersDisable = false;
    }
  }

  getAsText(file: any) {
    const reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(file);
    // Handle errors load
    reader.onload = this.loadHandler;
    reader.onerror = this.errorHandler;
  }

  loadHandler(event) {
    members = event.target.result;
  }

  errorHandler(evt) {
    if (evt.target.error.name === 'NotReadableError') {
      alert('Cannot read file !');
    }
  }

  extractMembers(input) {
    if (members) {
      return members;
    } else {
      // replace mutiple spaces, then mutiple add commas, then remove duplicate commas
      return (input) ? input.replace(/\s+/g, ' ').replace(/\s/g, ',').replace(/\,+/g, ',') : '';
    }
  }

  // Response of Create Groups API - CognitoCallback Interface
  cognitoCallback(message: string, result: any) {
      // TODO: implement..
      if (result) {
        // TODO: can we do this without a window reload?
        window.location.reload();
        this.router.navigate(['/home']);
      }
  }
  handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;

  callback() {}

  callbackWithParameters(error: AWSError, result: any) {}
  callbackWithParam(result: any): void { }

}
