import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CognitoUtil, Callback, LoggedInCallback, CognitoCallback } from './cognito.service';
import { User } from '../model/User';
@Injectable({
  providedIn: 'root'
})
export class ApiGatewayService implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  listActions(callback: LoggedInCallback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://o9qsu1id7j.execute-api.us-east-1.amazonaws.com/cis/actions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });

  }
  listUserActions(callback: LoggedInCallback) {
    // debugger;
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  listGroupsMetaData(callback: LoggedInCallback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://f6ss1zd1w0.execute-api.us-east-1.amazonaws.com/cis/adminData', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  listLevelData(callback: Callback): any {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://fw154850pg.execute-api.us-east-1.amazonaws.com/cis/LevelData', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.cognitoCallbackWithParam(data);
    });
  }
  getUserActions(callback, user) {
    const use = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + use + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  performAction(callback, user, action) {
    const use = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + use + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  deleteGroup(callback, group) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  adminDeleteAction(actionData, callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  adminCreateAction(actionData, callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  adminCreateGroupsData(groupsData: any, callback: CognitoCallback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.cognitoCallback(null, data);
    });
  }
  createLevelData(levelData, callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  getGroupMembers(callback, group) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  getAllGroups(callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://rfma1hd646.execute-api.us-east-1.amazonaws.com/cis/groups/list', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.cognitoCallbackWithParam(data);
    });
  }
  createGroup(groupData, callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
   
    const JSON_BODY = [];
    for (let i = 0; i < groupData.length; i++) {
      JSON_BODY.push({
        name: groupData[i].name,
        username: groupData[i].username, // leader
        description: groupData[i].description,
        zipCode: groupData[i].zipCode,
        groupAvatar: groupData[i].groupAvatar,
        groupType: groupData[i].groupType,
        groupSubType: groupData[i].groupSubType, // different than the array for metaData
        members: groupData[i].membersString,
        pointsEarned: groupData[i].pointsEarned
      });
    }
    const body = new Buffer(JSON.stringify(JSON_BODY)).toString('utf8');
    // const putParams = {
    //   FunctionName: 'createGroups',
    //   InvocationType: 'RequestResponse',
    //   LogType: 'None',
    //   Payload: JSON.stringify({
    //     httpMethod: 'POST',
    //     path: '/groups',
    //     resource: '',
    //     queryStringParameters: {
    //     },
    //     pathParameters: {
    //     },
    //     body: body
    //   })
    // };
    this.http.post('https://rfma1hd646.execute-api.us-east-1.amazonaws.com/cis/groups', JSON_BODY,{
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      }),
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.cognitoCallback(null, data);
    });
  }
  sendEmail(email, callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
}
