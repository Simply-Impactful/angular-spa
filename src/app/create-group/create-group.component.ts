import { Component, OnInit } from '@angular/core';
import { CreateGroupService } from '../services/creategroup.service';
import { Group } from '../model/Group';
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
// import { CognitoIdentityServiceProvider } from '../services/cognito.service';
import * as AWS from 'aws-sdk/global';
import { environment } from '../../environments/environment';
import { AuthenticationDetails, CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { CognitoCallback, CognitoUtil } from '../services/cognito.service';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  groupName: string = '';
  groupType: string = '';
  subcategory: string = '';
  zipcode: string = '';
  other: string = '';
  groupLeader: string = '';
  groupMember: string = '';
  isOther: Boolean = false;
  createdGroup: Group;
  isGroupCreated: boolean;
 // cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;


  constructor(private createGroupService: CreateGroupService, public cognitoUtil: CognitoUtil) { }

  ngOnInit() {
//    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});
 //   AWS.config.region = environment.region;
    //  const identityServiceProvider = new CognitoIdentityServiceProvider;
  //  this.cognitoIdentityServiceProvider.listUsers();
  //    AWS.identityServiceProvider.listUsers();
    // const client =  new CognitoIdentityServiceProvider({ apiVersion: '2015-03-31, region: 'us-east-1' });
    this.createdGroup = new Group();

  }

  toggleOption() {
    if (this.createdGroup.groupType === 'Other') {
      this.isOther = true;
    } else {
      this.isOther = false;
    }
  }

  addMember() {

//  userPool.listUsers();

    // x
  }

  creategroup() {
    // A service call will be made here to validate the credentials against what we have stored in the DB
    this.createGroupService.createGroup(this.createdGroup).subscribe();
  }

}
