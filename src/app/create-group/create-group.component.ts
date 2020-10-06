import { Component, OnInit } from '@angular/core';
import { Group } from '../model/Group';
import * as AWS from 'aws-sdk/global';
import { environment } from '../../environments/environment';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoCallback, LoggedInCallback, Callback, ChallengeParameters, CognitoUtil } from '../services/cognito.service';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk/global';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ApiGatewayService } from '../services/api-gateway.service';

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
  invalidUsers = [];
  generalError: string = '';
  invalidMembersError: string = '';
  invalidGroupLeader: string =  '';
  isValidGroup: boolean;
  myControl = new FormControl();
  membersResponse = [];
  filteredOptions: Observable<string[]>;
  membersArray = [];
  value: string;
  updated: boolean = false;

  constructor(public lambdaService: LambdaInvocationService,
    public router: Router,
    private cognitoUtil: CognitoUtil,
    private s3: S3Service,
    public apiService: ApiGatewayService) { }

  ngOnInit() {
    this.isFileReader = true;
    this.createdGroup = new Array<Group>();
    // this.lambdaService.listGroupsMetaData(this);
    this.apiService.listGroupsMetaData(this);
    this.getData();
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.membersResponse.filter(option => option.toLowerCase().includes(filterValue));
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
    // assume it can be created, unless below conditions set it to false
    this.isValidGroup = true;
    // fresh new group needs points set to 0
    this.createdGroup.pointsEarned = 0;
    this.createdGroup.groupAvatar = this.groupAvatarUrl;
    if (this.checkInputs()) {

      // Takes a comma and a space, and replaces it with a space
      if (this.createdGroup.membersString.includes(', ')) {
        this.createdGroup.membersString = this.createdGroup.membersString.replace(/\, +/g, ' ');
      }
      // if there's a comma, replace a comma with a space
      if (this.createdGroup.membersString.includes(',')) {
        this.createdGroup.membersString = this.createdGroup.membersString.replace(/\,+/g, ' ');
      }

      this.canCreateGroup(this.createdGroup.membersString.split(' ')).then(canCreateGroupResult => {
      if (canCreateGroupResult === true) {
        this.s3.uploadFile(this.groupAvatarFile, this.conf.imgFolders.groups, (err, location) => {
          if (err) {
            // we will allow for the creation of the item, we have a default image
            console.log(err);
            this.createdGroup.groupAvatar = this.conf.default.groupAvatar;
          } else {
            this.createdGroup.groupAvatar = location;
          }
         this.groupArray.push(this.createdGroup);
         this.lambdaService.createGroup(this.groupArray, this);
      });
      } else {
        this.invalidUsers = [];
        this.membersError = '';
      }
      });
    }
  }

  getData(): any {
    const promise = new Promise((resolve, reject) => {
      this.cognitoUtil.listUsers('Username').then(usernames => {
        this.membersResponse = usernames;
        resolve(true);
     });
   });
   return promise;
  }

  addToList(value: string) {
    this.value = value;
  }

  addToMembers() {
    this.membersArray.push(this.value);
  }

  update() {
    console.log('MEMBERS ' + JSON.stringify(this.membersArray));

    this.updated = true;
  }
  canCreateGroup(groupMembers: any): any {
    const optionalFilter = 'Username';
    const groupLeader = this.createdGroup.username;
     const promise = new Promise((resolve, reject) => {
       this.cognitoUtil.listUsers(optionalFilter).then(usernames => {
         this.membersResponse = usernames;
          if (!usernames.includes(groupLeader)) {
            this.isValidGroup = false;
            this.invalidGroupLeader = 'The leader is not a valid user. Please try entering another';
          } else {
            this.isValidGroup = true;
            this.invalidGroupLeader = '';
          }
          for (let index = 0; index < groupMembers.length; index++) {
            if (!usernames.includes(groupMembers[index])) {
              this.invalidUsers.push(groupMembers[index]);
              this.isValidGroup = false;
            }
          }
         if (!this.isValidGroup && this.invalidUsers.length >= 1) {
           this.invalidMembersError = 'The following users are invalid: ' + this.invalidUsers.toString() +
          '. Please remove these users and try again....';
          console.log(this.invalidMembersError);
         } else {
           this.invalidMembersError = '';
         }
         resolve(this.isValidGroup);
      });
    });
    return promise;
  }

  checkInputs() {
    if (!this.createdGroup.membersString) {
      this.membersError = 'You must enter at least one group member. Consider adding yourself';
    } else {
      this.membersError = '';
    }
    if (this.createdGroup.membersString && this.invalidUsers.length >= 1) {
      this.invalidMembersError = 'The following users are invalid: ' + this.invalidUsers.toString() +
      '. Please remove these users and try again.';
    } else {
      this.invalidMembersError = '';
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
      if (error.toString().includes('credentials')) {
        console.log('error - retrying' + JSON.stringify(error));
        // retry
        // this.lambdaService.listGroupsMetaData(this);
        this.apiService.listGroupsMetaData(this);
      }
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
      if (result) {
        const response = JSON.parse(result);
        if (response.statusCode === 200) {
          this.router.navigate(['/home']);
        }
      }
      // odd credential error occurred
      if (message) {
        if (message.includes('credentials')) {
          this.groupArray = [];
          // RETRY
          this.creategroup();
        }
      }
  }
  handleMFAStep ? (challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void ;

  callback() {}
  callbackWithParameters(error: AWSError, result: any) {}
  callbackWithParam(result: any): void {}

}
